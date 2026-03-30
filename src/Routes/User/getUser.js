import { Router } from "express";
import users from "../../data/users.js";
import { param, query, validationResult } from "express-validator";
import { validateUserIdMiddleware } from "../../server.js";


const router = Router();
// console.log(router);

// define a route
// get request :-
// app.get("/", (request, response) => {
//   // the request object :-
//   // request object it is related to everything incomming
//   // http request if you passed header from client side to server side that would be inside headers property of request object
//   // if want to send data in request body that would be assessed by grabbing from request body property
//   // wanted to access cookies, ipaddress,all the stuff comes from request object

//   // the responce object :-
//   // it is used to modify the response and send it back to user.
//   // you can send back data, text, html file, json object

//   // response.send("welcome to the express.js tutorial ");
//   // response.status(200).send("<h1>Hello from server </h1>");
//   response.status(200).send({ message: "Hello from server" });
//   // In Express, if you pass an object or array to res.send(), Express automatically converts it to JSON.
//   // Only when you pass an object or array to res.send() does Express convert it to JSON.
// });




// GET:-
// industry standard to start with /api/v1/..
// v1 is optionl (just info about first version of apis )
router.get("/allusers", (req, res) => {
  // this is the request handler
  res.status(200).send(users);
});







// QUERY PARAMS:-
// http://localhost:3000/api/v1/user/sorted?key=values&key2=values2
// i want to get all users from database but in sorted alphabetic order
// app.get(
//   "/api/v1/user/sorted",
//   query("filter")
//     .isString()
//     .isEmpty().isLength({min:3,max:5}),
//   (req, res) => {
//     // console.log(req.query);
//     const result = validationResult(req);
//     console.log(result);

//     const { filter, value, surname } = req.query;
//     if (!filter || !value || !surname) {
//       return res.status(200).send(users);
//     }
//     if (filter && value && surname) {
//       const findUser = users.filter((eachUser) => {
//         // console.log(String(eachUser[filter]).toLowerCase().split(" ")[0]);
//         const name = String(eachUser[filter]).toLowerCase().split(" ")[0];
//         const surName = String(eachUser[filter]).toLowerCase().split(" ")[1];
//         return (
//           name === value.toLowerCase() && surName === surname.toLowerCase()
//         );
//         // return name === value.toLowerCase();
//       });
//       return res.status(200).send(findUser);
//     }
//     return res.status(400).json({
//       message: "All query params (filter, value, surname) are required",
//     });
//   },
// );
router.get(
  "/sorted",
  query("filter")
    .notEmpty()
    .withMessage("filter is required")
    .isIn(["id", "name"])
    .withMessage("filter must be one of: id, name"),

  query("value")
    .notEmpty()
    .withMessage("value is required")
    .isString()
    .withMessage("value must be a string"),

  (req, res) => {
    // validation first :-
    const result = validationResult(req);
    if (result.isEmpty() === false) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({
          message: eachError.msg,
        })),
      });
    }
    // const {
    //   query: { filter, value },
    // } = req;
    const { filter, value } = req.query;
    // console.log(filter, value);
    // const result = validationResult(req);
    // console.log(result);
    // when filter and value is undefined the send all users
    if (!filter && !value) {
      return res.status(200).send(users);
    }
    if (filter && value) {
      const findUser = users.filter((eachUser) => {
        // first eachUser[filter] is like each["name"]/each["id"]
        // second is their are some num,boolean properties so needed to convert everything to sting and lowercaes
        return String(eachUser[filter]).toLowerCase() === value.toLowerCase();
      });
      if (findUser.length === 0) {
        // if userput 101 and there is no user with id 101 then findUser will be [] and length will be 0 so we can return 404 not found
        return res.status(404).json({
          message: "No users found",
          data: [],
        });
      }
      // search was valid, but nothing matched
      // if no match found -> returns []
      return res.status(200).send(findUser);
    }
    // fallback if filter is invalid
    return res.status(400).json({
      message: "Invalid filter. Use filter=name&value=someName",
    });
  },
);







// ROUTE parameters :-
router.get(
  "/:userId",
  param("userId")
	.notEmpty()
	.withMessage("userId is required")
	.isInt({ min: 1, max: 100 })
	.withMessage("userId is required and should be a number between 1 and 100"),
  validateUserIdMiddleware,
  (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
	  return res.status(400).json({
		errors: result.array().map((eachError) => ({ message: eachError.msg })),
	  });
	}
	const { findUserIndex } = req;
	const findUser = users[findUserIndex];
	console.log(findUser);

	if (findUser === -1) {
	  res.sendStatus(404);
	}
	res.status(200).send(findUser);
  },
);



export default router;
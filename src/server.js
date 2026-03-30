import express, { request } from "express";
import users from "./data/users.js";
import products from "./data/products.js";
import {
  query,
  validationResult,
  body,
  matchedData,
  param,
} from "express-validator";
// the express is imported using ('express') and app instance is created with express()
// a route is defined using app.get() method , which responds with message
const PORT = process.env.PORT || 3000;
const app = express();

// start the server:-
// app.listen() method starts the server and listen on port for incoming requests
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`server is running on http://localhost:${PORT}`);
  } else {
    console.log("error occured , server cant start ", error);
  }
});

// middleware :-
// middleware is a function that runs between the request and response cycle. It can modify the request and response objects, end the request-response cycle, or call the next middleware in the stack.
// middleware is used for various purposes like authentication, logging, error handling, parsing request bodies, etc.
// In Express, you can use app.use() to apply middleware globally to all routes, or you can apply it to specific routes by passing it as an argument to the route handler.
app.use(express.json());
// app.use(()=>{},()={})
// we can pass as many as middleware as we want in app.use() and in route handler as well

// example of custom middleware for logging:-
// const loggerMiddleware = (req, res, next) => {
//   console.log(`${req.method} and ${req.url}`);
//   console.log(`Response: ${res.statusCode}`);
//   // console.log(`Response: ${res.statusMessage}`);
//   // next();
//   // if we didnt call next() then the request will be stuck in the middleware and it willl never reach the route handler/ or next middleware and the server will not send any response to the client and it will be a bad user experience
// };

// instead of writing this loggerMiddleware for every route we can use app.use() to apply it globally to all routes
// app.use(loggerMiddleware);
// if i want to apply this Middleware only for specific route then i can pass it as an argument to the route handler like this
// app.get("/api/v1/some-route", loggerMiddleware, (req, res) => {}

// this is the exmple of multiple middleware for single route:-
// if we didnt apply next() in any of the middleware then the request will be stuck in that middleware and it will never reach the route handler/ or next middleware and the server will not send any response to the client and it will be a bad user experience
app.get(
  "/justgetrequest",
  (req, res, next) => {
    console.log(`here we will get the request method: ${req.method}`);
    next();
    // here in first middleware we are logging the request method and then calling next() to pass the control to the next middleware in the stack (↓)
  },
  (req, res, next) => {
    console.log(`here we will get the request url: ${req.url}`);
    // here in second middleware we are logging the request url and not calling next()  so the request will be stuck in this middleware and it will never reach the route handler/ or next middleware and the server will not send any response to the client
    // instead of next()  if we send response here from sever then also the request will be end here and it will never reach the route handler/ or next middleware and the server will send response to the clien
    // because we want to end the request-response cycle here and send the response back to the client
    // so basically if we want to end the request-response cycle in any middleware then we can send response from that middleware and we dont need to call next() because next() is used to pass the control
    // if we want to pass the control to the next middleware in the stack then we need to call next() and if we want to end the request-response cycle in any middleware then we can send response from that middleware and we dont need to call next() because next() is used to pass the control
    res.status(200).send({ message: "Hello from server" });
  },
  // (req, res, next) => {
  //   res.status(200).send({ message: "Hello from server" });
  // },
);

// here is the perfect example of midleware :-
// as many route handler we have we need to write common code for validation , parsing , filtering , sorting etc. in every route handler
// for put,patch,delete,get
const validateUserIdMiddleware = (req, res, next) => {
  // const {body,params:{Id}} =req;
  const { userId } = req.params;
  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const findUserIndex = users.findIndex((eachUser) => eachUser.id === parsedId);
  if (findUserIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  // console.log(findUserIndex);
  req.findUserIndex = findUserIndex;
  // next() does not automatically pass any data to the next middleware or route handler, but we can attach data to the req object (like req.findUserByid) and it will be accessible in the next middleware or route handler as well because they all share the same req object in the request-response cycle.
  // next() does take any argument, but it except an error object /null. If you pass an error object to next(), it will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware. If you pass null or nothing to next(), it will simply pass control to the next middleware or route handler in the stack.
  // next (new Error("Something went wrong") ) -> this will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware
  next();
};
const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((eachError) => ({
        message: eachError.msg,
      })),
    });
  }

  next();
};

// define a route
// get request :-
// app.get("/", (request, response) => {
//   // the request object :-
//   // request object it is related to everything incomming
//   // http request if you passed header from client side to server side that wold be inside headers property of request object
//   // if wante to send data in request body that would be assessed by grabbing from request body property
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
app.get(
  "/api/v1/allusers",
  // this is the request handler
  (req, res) => {
    res.status(201).send(users);
  },
);
app.get("/api/v1/allproducts", (req, res) => {
  res.status(201).send(products);
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
app.get(
  "/api/v1/user/sorted",
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
app.get(
  "/api/v1/user/:userId",
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

//  POST request :-
// used to create new data on backend server
// req.body :- whenever we make post/patch/put request the data that we want to send it to backed server you send via a payload or req.body.
// the backed will take that data and perform necessary operations it need validation / parsing / proper fields
// it does all this process before it proceeds wither saving it to database or saving in external api source
// it will return responce / and message / response
app.post(
  "/api/v1/user",
  body("age")
    .notEmpty()
    .withMessage("age cannot be empty")
    .isNumeric()
    .withMessage("age must be a number")
    .isInt({ min: 18, max: 50 })
    .withMessage("age should be between 18 and 50"),
  (req, res) => {
    // validation (always do brfore any processing of data in backend )
    const result = validationResult(req);
    // console.log(result);
    // if error are their then result.isEmpty() will be false and convert to true by ! so block code will execute
    // if errors are not present the result.isEmpty() will be true and convert to false by ! so block code will not execute and it will move forward to the next code
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({ message: eachError.msg })),
      });
    }

    const bodyData = matchedData(req);
    // console.log(data);
    // const newUser = req.body;
    // console.log(newUser);
    // console.log(req.body);
    // it shows undefined because express not parsing those request bodies are comming in (use express.json() middleware for that )

    if (!newUser.id || !newUser.name) {
      // For REST APIs:
      // use res.json() for objects/arrays
      // use res.send() for plain text / HTML / simple messages
      return res.status(400).json({
        message: "Please provide id and name",
      });
    }
    users.push(newUser);
    //   // need to use the inbuild middleware for this express.json()
    return res.status(201).json({
      message: "User successfully created",
      bodyData: newUser,
    });
  },
);

// PATCH request :-
// want to update some data on backend
// updates the data partially (not updating the entore data but some part/portion of it )
app.patch(
  "/api/v1/user/:userId",
  validateUserIdMiddleware,
  param("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("userId is required and should be a number between 1 and 100"),
  (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({ message: eachError.msg })),
      });
    }
    const {
      params: { userId },
      findUserIndex,
    } = req;
    const bodyData = matchedData(req);
    users[findUserIndex] = {
      ...users[findUserIndex], // keep old fields
      ...bodyData, // overwrite only sent fields
      // id: parsedId, // protect id
      id: parseInt(userId), //
    };

    return res.status(200).json({
      message: "User updated successfully",
      data: users[findUserIndex],
    });
  },
);

// PUT request :-
// not updating the small portion of request but updating the entire request
// updating the entire record
app.put(
  "/api/v1/user/:userId",
  param("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("userId is required and should be a number between 1 and 100"),
  validateUserIdMiddleware,
  (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({ message: eachError.msg })),
      });
    }
    const {
      params: { userId },
      findUserIndex,
    } = req;
    const bodyData = matchedData(req);
    // still here need the req.body and req.params.userId because we need to update the user with the id which is coming from route param and we need the body to update the user
    // console.log(users[findUserIndex]);
    users[findUserIndex] = {
      // id: users[findUserIndex].id, //
      id: parseInt(userId),
      // id: parsedId,
      ...bodyData, // replace full user
    };
    return res.status(200).json({
      message: "User updated successfully",
      data: users[findUserIndex],
    });
  },
);

// DELETE request :-
// delete the data from backend
app.delete(
  "/api/v1/user/:userId",
  param("userId")
    .isInt({ min: 1, max: 100 })
    .withMessage("userId is required and should be a number between 1 and 100"),
  validateRequest,
  validateUserIdMiddleware,
  (req, res) => {
    // validation
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({ message: eachError.msg })),
      });
    }
    const { findUserIndex } = req;
    users.splice(findUserIndex, 1);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  },
);

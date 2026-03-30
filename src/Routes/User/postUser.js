import { Router } from "express";
import { body, matchedData, validationResult } from "express-validator";
import users from "../../data/users.js";

// const router = Router();

// //  POST request :-
// // used to create new data on backend server
// // req.body :- whenever we make post/patch/put request the data that we want to send it to backed server you send via a payload or req.body.
// // the backed will take that data and perform necessary operations it need validation / parsing / proper fields
// // it does all this process before it proceeds wither saving it to database or saving in external api source
// // it will return responce / and message / response
// router.post(
//   "/",
//   body("id")
//     .notEmpty()
//     .withMessage("id cannot be empty")
//     .isInt({ min: 1 })
//     .withMessage("id must be a positive integer"),

//   body("name")
//     .notEmpty()
//     .withMessage("name cannot be empty")
//     .isString()
//     .withMessage("name must be a string"),

//   body("age")
//     .notEmpty()
//     .withMessage("age cannot be empty")
//     .isNumeric()
//     .withMessage("age must be a number")
//     .isInt({ min: 18, max: 50 })
//     .withMessage("age should be between 18 and 50"),
//   (req, res) => {
//     // validation (always do brfore any processing of data in backend )
//     const result = validationResult(req);
//     // console.log(result);
//     // if error are their then result.isEmpty() will be false and convert to true by ! so block code will execute
//     // if errors are not present the result.isEmpty() will be true and convert to false by ! so block code will not execute and it will move forward to the next code
//     if (!result.isEmpty()) {
//       return res.status(400).json({
//         errors: result.array().map((eachError) => ({ message: eachError.msg })),
//       });
//     }
//     // const bodyData = matchedData(req);
//     // matchedData() only returns fields that passed validation / sanitization.
//     // So if you don’t validate a field, it will not be included.
//     // console.log(data);
//     const newUser = req.body;
//     // console.log(newUser);
//     // console.log(req.body);
//     // it shows undefined because express not parsing those request bodies are comming in (use express.json() middleware for that )

//     const existingUser = users.find((user) => user.id === newUser.id);

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User with this ID already exists",
//       });
//     }

//     if (!newUser.id || !newUser.name) {
//       // For REST APIs:
//       // use res.json() for objects/arrays
//       // use res.send() for plain text / HTML / simple messages
//       return res.status(400).json({
//         message: "Please provide id and name",
//       });
//     }
//     users.push(newUser);
//     // need to use the inbuild middleware for this express.json()
//     return res.status(201).json({
//       message: "User successfully created",
//       data: newUser,
//     });
//   },
// );

// export default router;


const router = Router();

router.post(
  "/",
  body("id")
    .notEmpty()
    .withMessage("id cannot be empty")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),

  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isString()
    .withMessage("name must be a string"),

  body("age")
    .notEmpty()
    .withMessage("age cannot be empty")
    .isNumeric()
    .withMessage("age must be a number")
    .isInt({ min: 18, max: 50 })
    .withMessage("age should be between 18 and 50"),

  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map((eachError) => ({
          field: eachError.path,
          message: eachError.msg,
        })),
      });
    }

    const newUser = req.body;

    // extra safety: if body not parsed
    if (!newUser) {
      return res.status(400).json({
        message: "Request body is missing. Make sure express.json() is used.",
      });
    }

    // duplicate id check
    const existingUser = users.find((user) => user.id === newUser.id);

    if (existingUser) {
      return res.status(400).json({
        message: "User with this ID already exists",
      });
    }

    users.push(newUser);

    return res.status(201).json({
      message: "User successfully created",
      data: newUser,
    });
  }
);

export default router;
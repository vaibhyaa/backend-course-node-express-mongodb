import { Router } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUser } from "../../controller/UserController/postUser.controller.js";

// //  POST request :-
// // used to create new data on backend server
// // req.body :- whenever we make post/patch/put request the data that we want to send it to backed server you send via a payload or req.body.
// // the backed will take that data and perform necessary operations it need validation / parsing / proper fields
// // it does all this process before it proceeds wither saving it to database or saving in external api source
// // it will return responce / and message / response

const router = Router();

router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isString()
    .withMessage("name must be a string"),

  body("age")
    .notEmpty()
    .withMessage("age cannot be empty")
    .isInt({ min: 18, max: 50 })
    .withMessage("age should be between 18 and 50"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber cannot be empty")
    .matches(/^[0-9]{10}$/)
    .withMessage("phoneNumber must be a valid 10-digit number"),

  body("address.city").notEmpty().withMessage("city cannot be empty"),

  body("address.state").notEmpty().withMessage("state cannot be empty"),

  body("address.pincode")
    .notEmpty()
    .withMessage("pincode cannot be empty")
    .matches(/^[0-9]{6}$/)
    .withMessage("pincode must be a valid 6-digit number"),

  body("isMarried")
    .optional()
    .isBoolean()
    .withMessage("isMarried must be boolean"),

  body("isEmployed")
    .optional()
    .isBoolean()
    .withMessage("isEmployed must be boolean"),
  validateRequest,
  createUser,
);

export default router; //imported as userPostRouter

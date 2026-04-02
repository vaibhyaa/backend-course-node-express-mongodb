import { Router } from "express";
import { matchedData, param, body, validationResult } from "express-validator";
import { validateRequest } from "../../middleware/validateRequest.js";
import { validateUserIdMiddleware } from "../../middleware/validateUserIdMiddleware.js";
import { updateUser } from "../../controller/UserController/updateUser.controller.js";
// PATCH request :-
// want to update some data on backend
// updates the data partially (not updating the entore data but some part/portion of it )

// PUT
// Usually used for full update
// All updatable fields should be sent
// Use .notEmpty() for required updatable fields
// PATCH
// Used for partial update
// Fields are optional
// Use .optional() + type validation

const router = Router();

router.patch(
  "/:userId",
  param("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt({ min: 1 })
    .withMessage("userId should be a positive number"),

  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("phoneNumber must be a string"),

  body("address")
    .optional()
    .isObject()
    .withMessage("address must be an object"),

  body("address.city")
    .optional()
    .isString()
    .withMessage("city must be a string"),

  body("address.state")
    .optional()
    .isString()
    .withMessage("state must be a string"),

  body("address.pincode")
    .optional()
    .isString()
    .withMessage("pincode must be a string"),

  body("isMarried")
    .optional()
    .isBoolean()
    .withMessage("isMarried must be boolean"),

  body("isEmployed")
    .optional()
    .isBoolean()
    .withMessage("isEmployed must be boolean"),

  validateRequest,
  validateUserIdMiddleware,
  updateUser,
);

export default router;

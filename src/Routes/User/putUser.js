import { Router } from "express";
import users from "../../data/users.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { validateUserIdMiddleware } from "../../middleware/validateUserIdMiddleware.js";

import { body, param } from "express-validator";
import { updateUserFull } from "../../controller/UserController/updateUserFull.controller.js";

const router = Router();

// PUT request :-
// not updating the small portion of request but updating the entire request
// updating the entire record

// PUT
// Usually used for full update
// All updatable fields should be sent
// Use .notEmpty() for required updatable fields
// PATCH
// Used for partial update
// Fields are optional
// Use .optional() + type validation

router.put(
  "/:userId",
  // BECAUSE NAME AND AGE WILL NOT ABLE ABLE TO CHANGE EVEN IF WE PASS WE WILL DELETE THAT FROM OBJECT AND IGNORED
  param("userId").notEmpty().isInt(),
  body("phoneNumber").notEmpty().isString(),
  body("address").notEmpty().isObject(),
  body("address.city").notEmpty().isString(),
  body("address.state").notEmpty().isString(),
  body("address.pincode").notEmpty().isString(),
  body("isMarried").notEmpty().isBoolean(),
  body("isEmployed").notEmpty().isBoolean(),
  validateRequest,
  validateUserIdMiddleware,
  updateUserFull,
);

export default router;

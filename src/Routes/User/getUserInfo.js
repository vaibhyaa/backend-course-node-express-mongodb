import { Router } from "express";
import { param, query } from "express-validator";
import { validateUserIdMiddleware } from "../../middleware/validateUserIdMiddleware.js";
import {
  getAllUsers,
  getUserById,
  getUserSorted,
} from "../../controller/UserController/getUserDetails.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = Router();

router.get("/allusers", getAllUsers);

// QUERY PARAMS:-
// http://localhost:3000/api/v1/user/sorted?key=values&key2=values2
// i want to get all users from database but in sorted alphabetic order
router.get(
  "/sorted",
  (req, res, next) => {
    console.log("Route hit!", req.query); // always prints
    next(); // continue to validation
  },
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
  validateRequest,
  getUserSorted,
);

// ROUTE parameters :-
router.get(
  "/:userId",
  param("userId").notEmpty().withMessage("userId is required"),
  // .isInt({ min: 1, max: 100 })
  // .withMessage("userId is required and should be a number between 1 and 100"),
  validateRequest,
  validateUserIdMiddleware,
  getUserById,
);

export default router;

import { Router } from "express";
import { validateRequest, validateUserIdMiddleware } from "../../server.js";
import { param, validationResult } from "express-validator";
import users from "../../data/users.js";

const router = Router();

// DELETE request :-
// delete the data from backend
router.delete(
  "/:userId",
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


export default router;
import { Router } from "express";
import { matchedData, param, validationResult } from "express-validator";
import { validateRequest, validateUserIdMiddleware } from "../../server.js";
import users from "../../data/users.js";
// PATCH request :-
// want to update some data on backend
// updates the data partially (not updating the entore data but some part/portion of it )

const router = Router();

router.patch(
  "/:userId",
  param("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("userId is required and should be a number between 1 and 100"),
  validateRequest,
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



export default router;
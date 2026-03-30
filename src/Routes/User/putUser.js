import { Router } from "express";
import { matchedData, param, validationResult } from "express-validator";
import { validateRequest, validateUserIdMiddleware } from "../../server.js";
import users from "../../data/users.js";


const router = Router();


// PUT request :-
// not updating the small portion of request but updating the entire request
// updating the entire record
router.put(
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


export default router;
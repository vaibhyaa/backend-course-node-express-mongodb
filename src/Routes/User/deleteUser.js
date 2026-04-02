import { Router } from "express";

import { param, } from "express-validator";
import { validateRequest } from "../../middleware/validateRequest.js";
import { validateUserIdMiddleware } from "../../middleware/validateUserIdMiddleware.js";
import { deleteUser } from "../../controller/UserController/deleteUser.controller.js";

const router = Router();
// DELETE request :-
// delete the data from backend
router.delete(
  "/:userId",
  param("userId")
    .isInt({ min: 1, max: 100 })
    .withMessage("regestired Id is required"),
  validateRequest,
  validateUserIdMiddleware,
  deleteUser
  
);

export default router;

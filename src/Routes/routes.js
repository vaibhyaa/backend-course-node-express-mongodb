import { Router } from "express";

const router = Router();

import userGetRouter from "./User/Getuser.js";
import userPostRouter from "./User/PostUser.js";
import userPatchRouter from "./User/patchUser.js";
import userPutRouter from "./User/putUser.js";
import userDeleteRouter from "./User/deleteUser.js";


import getProductRouter from "./Product/getProduct.js";

// routers for user  :-
router.use("/api/v1/user", userGetRouter);
router.use("/api/v1/user", userPostRouter);
router.use("/api/v1/user", userPatchRouter);
router.use("/api/v1/user", userPutRouter);
router.use("/api/v1/user", userDeleteRouter);

// routers for products :-
router.use("/api/v1/product", getProductRouter);



export default router;

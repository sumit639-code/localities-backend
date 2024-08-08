import { Router } from "express";
import { userDelete, userLogin, userRegister } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.route('/register').post(userRegister);
userRouter.route('/login').post(userLogin);
userRouter.route('/delete').post(userDelete);


export default userRouter;
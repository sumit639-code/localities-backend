import { Router } from "express";
import {
  userDelete,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
  ]),
  userRegister
);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(verifyJwt, userLogout);
userRouter.route("/delete").post(userDelete);

export default userRouter;

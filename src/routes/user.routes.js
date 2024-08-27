import { Router } from "express";
import {
  follow,
  getUser,
  userDelete,
  userLogin,
  userLogout,
  userProfile,
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
userRouter.route("/getuser").get(verifyJwt, getUser);
userRouter.route("/userprofile").post(verifyJwt, userProfile);
userRouter.route("/delete").post(userDelete);
userRouter.route("/follow").post(verifyJwt, follow);

export default userRouter;

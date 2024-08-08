import { User } from "../models/user.models";
import { apierror } from "../utils/apierror";
import { asynchandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken";
export const verifyJwt = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new apierror(300, "user is not authorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apierror(400, "token cant be verified");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error, "There is error while verify Jwt.");
  }
});

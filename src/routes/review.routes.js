import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { writeReview } from "../controllers/review.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const reviewRoute = Router();

reviewRoute.route("/writereview").post(
  verifyJwt,
  upload.fields({
    name: "reviewImages",
    maxCount: 3,
  }),
  writeReview
);


export default reviewRoute;
import { Router } from "express";
import { addProduct } from "../controllers/product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.route("/addproduct").post(
  verifyJwt,
  upload.fields([
    {
      name: "productImages",
      maxCount: 4,
    },
  ]),
  addProduct
);

export default productRouter;

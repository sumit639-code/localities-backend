import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  products,
} from "../controllers/product.controllers.js";
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
productRouter.route("/products").get(verifyJwt, products);
productRouter.route("/editproduct").post(verifyJwt, editProduct);
productRouter.route("/deleteproduct").delete(verifyJwt, deleteProduct);

export default productRouter;

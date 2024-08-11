import { Product } from "../models/product.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const addProduct = asynchandler(async (req, res) => {
  const user = req.user;
  console.log(req.body);

  const { buisness, name, description, price, category, productImages } =
    req.body;
  // buisness = user._id;
  // productImages = req.files?.profilePicture[0]?.path;
  if (!(name, description, price, category)) {
    throw new apierror(300, "the feilds are empty, required!.");
  }
  const productimage = req.files.productImages;
  const productImgPath = [];
  productImages.map((fn) => {
    productImgPath.push(fn.path);
  });
  const products = await Product.create({
    buisness: user._id,
    name: name,
    description: description,
    price: price,
    category: category,
    productImages: productImgPath,
  });
  console.log(productimage);

  return res
    .status(200)
    .json(new apiresponse(200, productimage, "products has been added"));
});

const editProduct = asynchandler(async (req, res) => {
  const user = req.user;
  const { _id } = req.body;
  const product = await Product.findById(_id);
  if (!(user._id == product.buisness)) {
    throw new apierror(300, "user is not authorised to delete the product");
  }
  const { name, description, price, category } = req.body;
  const editProduct = await Product.findByIdAndUpdate(_id, {
    name: name,
    description: description,
    price: price,
    category: category,
  });
  return res
    .status(200)
    .json(200, editProduct, "product details has been updated");
});

const deleteProduct = asynchandler(async (req, res) => {
  //owner match
  const user = req.user;
  const { _id } = req.body;
  const product = await Product.findById(_id);
  if (!(user._id == product.buisness)) {
    throw new apierror(300, "user is not authorised to delete the product");
  }
  const productRemove = await Product.findByIdAndDelete(_id);

  return res
    .status(200)
    .json(new apiresponse(200, productRemove, "Product has been deleted"));
});

export { addProduct, deleteProduct, editProduct };

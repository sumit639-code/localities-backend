import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudUploader } from "../utils/cloudinary.js";

const products = asynchandler(async (req, res) => {
  // Get all products from the database
  const allProducts = await Product.find();

  // Create an array to hold the products with additional data
  const products = await Promise.all(
    allProducts.map(async (fn) => {
      // Find the user associated with the product
      let user = await User.findById(fn.buisness);

      // Return an object with the desired properties
      return {
        id: fn._id,
        username: user ? user.name : "Unknown User", // Handle case where user is not found
        userprofile:user.profilePicture,
        productname: fn.name,
        description: fn.description,
        images: fn.productImages,
        createdat: fn.createdAt,
      };
    })
  );

  // Log the products for debugging purposes
  console.log(allProducts);
  console.log(products);

  // Return the products as a JSON response
  return res
    .status(200)
    .json(new apiresponse(200, products, "Products are being displayed"));
});

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
  const productImgPath = await Promise.all(
    productimage.map(async (fn) => {
      const url = await cloudUploader(fn.path);
      console.log(url.url);
      return url.url; // Return the URL so that it will be part of the array in Promise.all
    })
  );
  console.log(productImgPath);

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
    .json(new apiresponse(200, products, "products has been added"));
});

const editProduct = asynchandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  console.log(req.body, "body");

  const user = req.user;
  const productDet = await Product.findOne({ name });
  console.log(productDet.buisness, user._id);

  // const _id = productDet._id;
  // const { _id } = req.body;
  // const product = await Product.findById(_id);
  if (user._id.toString() !== productDet.buisness.toString()) {
    throw new apierror(300, "user is not authorised to delete the product");
  }
  const editProduct = await Product.findByIdAndUpdate(productDet._id, {
    name: name,
    description: description,
    price: price,
    category: category,
  });
  return res
    .status(200)
    .json(
      new apiresponse(200, editProduct, "product details has been updated")
    );
});

const deleteProduct = asynchandler(async (req, res) => {
  //owner match

  const { name, description, price, category } = req.body;
  console.log(req.body, "body");

  const user = req.user;
  const productDet = await Product.findOne({ name });
  console.log(productDet.buisness, user._id);

  // const _id = productDet._id;
  // const { _id } = req.body;
  // const product = await Product.findById(_id);
  if (user._id.toString() !== productDet.buisness.toString()) {
    throw new apierror(300, "user is not authorised to delete the product");
  }

  // const user = req.user;
  // const { _id } = req.body;
  // const product = await Product.findById(_id);
  // if (!(user._id == product.buisness)) {
  //   throw new apierror(300, "user is not authorised to delete the product");
  // }
  const productRemove = await Product.findByIdAndDelete(productDet._id);

  return res
    .status(200)
    .json(new apiresponse(200, productRemove, "Product has been deleted"));
});

export { addProduct, deleteProduct, editProduct, products };

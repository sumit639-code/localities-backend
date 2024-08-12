import { Product } from "../models/product.models.js";
import Review from "../models/review.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const writeReview = asynchandler(async (req, res) => {
  const user = req.user;
  const { productId, rating, comment } = req.body;
  const product = await Product.findById(productId);
//   if (product._id.toString() == user._id.toString()) {
//     throw new apierror(
//       200,
//       "You are same user you cant review the same product"
//     );
//   }
const review  = await Review.create({
    user:user._id,
    product:product._id,
    rating:rating,
    comment:comment
})
  console.log(product);
  return res.status(200).json(new apiresponse(200, review, "working"));
});

export { writeReview };

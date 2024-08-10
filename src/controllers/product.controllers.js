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
    if(!(name,description,price,category)){
        throw new apierror(300,"the feilds are empty, required!.")
    }
    const productimage = req.files;
    // const products = await Product.create({
    //     buisness:user._id,
    //     name:name,
    //     description:description,
    //     price:price,
    //     category:category,

    // })
    console.log(productimage);
    
    return res.status(200).json(new apiresponse(200,productimage,"products has been added"))
});

export { addProduct };

import { User } from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import bcrypt from 'bcrypt';



const userRegister = asynchandler(async (req,res)=>{
    const {name, email,password,profilePicture} = req.query;
    console.log(req.files);
    
    console.log(name,email,password);
    if(!(name && email && password) || (name == "" || email == "" || password == "")){
        throw new apierror(305,"username or email or password is empty")
    }
    // const existedUser = await User.findOne(email);
    // if(existedUser){
    //     throw new apierror(302,"user already ecisted");
    // }
    // const newpassword =await bcrypt.hash(password,10)
    res.send({name,email,password,profilePicture})
})





export {userRegister}
import { User } from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudUploader } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    console.log(accessToken);

    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "error while creating accessToken & refreshToken");
  }
};

const userRegister = asynchandler(async (req, res) => {
  const { name, email, password, userType, buisnessName, profilePicture } =
    req.body;
  console.log("req.body :", req.body);

  console.log(name, email, password);
  console.log("files", req.files);
  if (
    !(name && email && password) ||
    name == "" ||
    email == "" ||
    password == ""
  ) {
    throw new apierror(305, "name or email or password is empty");
  }

  if (userType == "buisness") {
    if (!(buisnessName && buisnessDesc && location && categories)) {
      throw new apierror(300, "These feilds are required.");
    } else {
      console.log("Buisness is not working");
    }
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new apierror(302, "user already existed");
  }
  if (password.length <= 4) {
    throw new apierror(304, "password length should be more.");
  }
  const profilePicUrl = req.files?.profilePicture[0]?.path;
  console.log("url", profilePicUrl);

  const profilePic = await cloudUploader(profilePicUrl);
  const createUser = await User.create({
    name: name,
    email: email,
    password: password,
    userType: userType,
    profilePicture: profilePic.url,
  });
  if (!createUser) {
    throw new apierror(400, "there is some error while saving the data.");
  }

  const createdUser = await User.findById(createUser._id).select(
    "-password  -refreshToken"
  );
  return res
    .status(200)
    .json(new apiresponse(200, createdUser, "user has been created."));
});

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apierror(404, "Email and password fields can't be empty.");
  }

  const getUser = await User.findOne({ email });
  if (!getUser) {
    throw new apierror(404, "User is not registered.", [getUser]);
  }

  const passValid = await getUser.isPasswordCorrect(password);
  if (!passValid) {
    throw new apierror(401, "Invalid password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    getUser._id
  );
  console.log(accessToken, refreshToken);

  const createdUser = await User.findById(getUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
    sameSite: "strict", // Optionally, add sameSite attribute for additional security
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiresponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User is logged in."
      )
    );
});

const userLogout = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apierror(300, "there is some error getting the user");
  }
  const remRefresh = await User.findByIdAndUpdate(user._id, {
    refreshToken: "",
  });
  const options = {
    httpsOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiresponse(200, "user has been successfully logout"));
});

//temp userDelete option later i will add on the use of JWT and have the user and get the data from there and have the delete option to be available.
const userDelete = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new apierror(300, "User doesnt exist");
  }
  const userDel = await User.findByIdAndDelete(user._id);
  if (!userDel) {
    throw new apierror(
      400,
      "there is some error from the database while deleting the user"
    );
  }

  return res
    .status(200)
    .json(new apiresponse(200, userDel, "User is being been delted"));
});

const userProfile = asynchandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new apierror(403, "cant get the user you are searching for");
  }

  const product = await Product.find();
  const products = await Promise.all(
    product.map(async (fn) => {
      // Find the user associated with the product

      // Check if the business ID matches the user ID
      if (user && user._id.toString() === fn.buisness.toString()) {
        // If true, return the product details
        return {
          id: fn._id,
          images: fn.productImages,
        };
      }
    })
  );
  const validProducts = products.filter(Boolean);
  const userData = {
    profilePicture: user.profilePicture,
    name: user.name,
    posts: validProducts,
    following: user.following,
    followers: user.followers,
  };
  return res
    .status(200)
    .json(new apiresponse(200, userData, "getting the user profile"));
});
const getUser = asynchandler(async (req, res) => {
  const user = await User.find();
  return res
    .status(200)
    .json(new apiresponse(200, user, "Getting user detials"));
});

const follow = asynchandler(async (req, res) => {
  const { id } = req.body;
  const profileUser = await User.findById(id);
  const user = req.user;
  if (!profileUser) {
    throw new apierror(400, "can't get userprofile data.");
  }
  if (!user) {
    throw new apierror(400, "can't get user data");
  }
  if (user._id.toString() === profileUser._id.toString()) {
    throw new apierror(300, "same user cant be followed");
  }
  if (user.following.includes(profileUser._id)) {
    throw new apierror(400, "You are already following this user.");
  }

  // Add profileUser to user's following list and add user to profileUser's followers list
  user.following.push(profileUser._id);
  profileUser.followers.push(user._id);

  await user.save();
  await profileUser.save();
  return res
    .status(200)
    .json(new apiresponse(200, profileUser, "user has beem followed"));
});

const dataprofiledata = asynchandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apierror(403, "cant get the user you are searching for");
  }

  const product = await Product.find();
  const products = await Promise.all(
    product.map(async (fn) => {
      // Find the user associated with the product

      // Check if the business ID matches the user ID
      if (user && user._id.toString() === fn.buisness.toString()) {
        // If true, return the product details
        return {
          id: fn._id,
          images: fn.productImages,
        };
      }
    })
  );
  const validProducts = products.filter(Boolean);
  const userData = {
    profilePicture: user.profilePicture,
    name: user.name,
    posts: validProducts,
    following: user.following,
    followers: user.followers,
  };
  console.log(user);
  
  return res
    .status(200)
    .json(new apiresponse(200, userData, "user details are being shown"));
});

export {
  userRegister,
  userLogin,
  userDelete,
  userLogout,
  getUser,
  userProfile,
  follow,
  dataprofiledata
};

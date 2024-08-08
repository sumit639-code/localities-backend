import { User } from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // console.log(accessToken);

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "error while creating accessToken & refreshToken");
  }
};

const userRegister = asynchandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;
  console.log(req.body);

  console.log(name, email, password);
  if (
    !(name && email && password) ||
    name == "" ||
    email == "" ||
    password == ""
  ) {
    throw new apierror(305, "username or email or password is empty");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new apierror(302, "user already existed");
  }
  if (password.length <= 4) {
    throw new apierror(304, "password length should be more.");
  }

  const createUser = await User.create({
    name: name,
    email: email,
    password: password,
  });
  if (!createUser) {
    throw new apierror(400, "there is some error while saving the data.");
  }

  const createdUser = await User.findById(createUser._id).select(
    "-password , refreshToken"
  );
  return res
    .status(200)
    .json(new apiresponse(200, createdUser, "user has been created."));
});

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "") {
    throw new apierror(304, "user or password feild cant be empty");
  }

  const getUser = await User.findOne({ email });
  if (!getUser) {
    throw new apierror(400, "user is not registered.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    getUser._id
  );
    console.log({accessToken},{refreshToken});

  const createdUser = await User.findById(getUser._id).select(
    "-password -refreshToken"
  );
  const passValid = await getUser.isPasswordCorrect(password);
  if (!passValid) {
    throw new apierror(306, "password is invalid");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiresponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "user is logged In."
      )
    );
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
export { userRegister, userLogin, userDelete };

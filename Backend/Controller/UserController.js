const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const Profile = require("../Models/Profile");
const generateToken = require("../Config/genrateToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const JWT_SECRET=process.env.JWT_SECRET;
const registerUser = asyncHandler(async (req, res) => {
  const { Name, Email, Password, ConfirmPassword } = req.body;
  console.log(Profile);
  if (!Name || !Email || !Password || !ConfirmPassword) {
    return res.status(400).json({ msg: "Please fill all required field" });
  }
  if (Password !== ConfirmPassword) {
    return res.status(404).json({ msg: "Both password must be same" });
  }
  const userExist = await User.findOne({ Email });
  if (userExist) {
    return res.status(401).json({ msg: "User with this email already exist." });
  }
  const salt = await bcrypt.genSalt(10);
  const secpass = await bcrypt.hash(Password, salt);

  const user = await User.create({
    Name,
    Email,
    Password: secpass,
  });
  if (user) {
    await Profile.create({
      User: user._id,
      Name: user.Name,
      Email: user.Email,
      Bio: "",
      Role: "",
      TotalRevenue: [],
      Image: "",
      ContactInformation: {
        CompanyEmail: "",
        Phone: "",
        LinkedInProfile: "",
        CompanyWebsite: "",
        OfficeAddress: "",
      },
      Experience: "",
      StartUpDetails: []
    });
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      Token: generateToken(user._id),
    });
  } else {
    return res.status(401).json({ msg: "failed to create user." });
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  const user = await User.findOne({ Email });
  const passwordCompare = await bcrypt.compare(Password, user.Password);
  if (user && passwordCompare) {
    res.status(200).json({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      Token: generateToken(user._id),
    });
  } else {
    return res.status(401).json({ msg: "Invalid credentials." });
  }
});
const FetchAllUser = asyncHandler(async (req, res) => {
  const AllUser = await User.find().select("-Password");
  if (AllUser) {
    res.status(200).json(AllUser);
  } else {
    res.status(404).json({ msg: "No user Found" });
  }
});
module.exports = { registerUser, authUser, FetchAllUser };

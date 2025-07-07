import asyncHandler from 'express-async-handler';
import User from '../models/usermodel.js';
import generateToken from '../config/generatetoken.js';
import { uploadCloudanary } from '../fileUpload/cloudinary.js';
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePicUrl= null;


    if (req.file) {
      try {
        const cloudResult = await uploadCloudanary(req.file.path);
        profilePicUrl = cloudResult.secure_url;

        //  Delete local temp file
        fs.unlinkSync(req.file.path);
        console.log("Uploaded to Cloudinary:", profilePicUrl);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      console.warn(" No profile image uploaded");
    }

    // 👤 Create the user
    const user = await User.create({
      name,
      email,
      password, // Assuming password hashing is handled in schema pre-save
      pic: profilePicUrl,
    });

    console.log(" User created:", user._id);

    // Respond with user and token
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error(" Registration failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            message: "user login successfully",
            user: { name: user.name, email: user.email, pic: user.pic, _id: user._id },
            token: generateToken(user._id),
        });
    }
});

const allusers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

export { registerUser, authUser, allusers };
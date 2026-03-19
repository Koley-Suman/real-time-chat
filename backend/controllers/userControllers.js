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



    // 👤 Create the user
    const user = await User.create({
      name,
      email,
      password, // Assuming password hashing is handled in schema pre-save

    });

    console.log(" User created:", user._id);

    // Respond with user and token
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,

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
      user: { name: user.name, email: user.email, pic: user.pic, _id: user._id, bio: user.bio },
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
const uploadPic = asyncHandler(async (req, res) => {
  try {
    const { bio } = req.body;

    let profilePicUrl = null;


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



    const user = await User.findByIdAndUpdate(req.user._id,
      {
        ...(profilePicUrl && { pic: profilePicUrl }),
        ...(bio && { bio }),
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "Profile setup successfully",
      user: { name: user.name, email: user.email, pic: user.pic, _id: user._id, bio: user.bio },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
  }
})

 const updateUser = asyncHandler(async (req, res) => {
  try {
     const name = req.body?.name;
    const bio = req.body?.bio;
    console.log(name);
    console.log(bio);
    

    let profilePicUrl;

    // Upload new profile image if provided
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

    // Build update object dynamically
    const updateFields = {};

    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (profilePicUrl) updateFields.pic = profilePicUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      name: updatedUser.name,
      bio: updatedUser.bio,
      pic: updatedUser.pic,
      email: updatedUser.email,
      _id: updatedUser._id,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
});

export { registerUser, authUser, allusers, uploadPic, updateUser };
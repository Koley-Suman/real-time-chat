import asyncHandler from 'express-async-handler';
import Chat from '../models/chatmodel.js';
import User from '../models/usermodel.js';
import { uploadCloudanary } from '../fileUpload/cloudinary.js';
import fs from "fs";
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.error("UserId param not sent with request");
        return res.status(400).send({ message: "UserId param not sent with request" });

    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email"
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error creating chat" });
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error fetching chats" });
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    const { name, users } = req.body;
    if (!name || !users) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }
    var usersArray = JSON.parse(users);
    if (usersArray.length < 2) {
        return res.status(400).send({ message: "More than 2 users are required to form a group chat" });
    }
    usersArray.push(req.user._id);
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
    try {
        const groupChat = await Chat.create({

            chatName: name,
            users: usersArray,
            isGroupChat: true,
            groupAdmin: req.user._id,
            groupPic: profilePicUrl,
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).send(fullGroupChat);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error creating group chat" });
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    res.status(200).send(updatedChat);
    if (!updatedChat) {
        return res.status(404).send({ message: "Chat not found" });
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).send({ message: "userIds must be a non-empty array" });
    }
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $addToSet: { users: { $each: userIds } },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!added) {
        return res.status(404).send({ message: "Chat not found" });
    }
    if (!added) {
        return res.status(404).send({ message: "Chat not found" });
    }
    res.status(200).send(added);
})
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        return res.status(404).send({ message: "Chat not found" });
    }
    res.status(200).send(removed);
});

export { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };
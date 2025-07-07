import asyncHandler from 'express-async-handler';
import Message from '../models/messagemodel.js';
import Chat from '../models/chatmodel.js';
import User from '../models/usermodel.js';
import { uploadCloudanary } from '../fileUpload/cloudinary.js';
import path from "path";
import fs from "fs";
const sendMessage = asyncHandler(async (req, res) => {

    const { content, chatId } = req.body;
    if (!chatId || (!content && !req.file)) {
        return res.status(400).send({ message: "Invalid data passed into request" });
    }
    let image = null;


    if (req.file) {
        try {
            const filePath = path.resolve(req.file.path);
            const cloudResult = await uploadCloudanary(req.file.path);
            image = cloudResult.secure_url;

            fs.unlink(filePath, (err) => {
            if (err) {
            console.error("❌ Failed to delete temp file:", err);
            } else {
            console.log("✅ Temp file deleted:", filePath);
            }
            });
            
       
            console.log("Uploaded to Cloudinary:", image);
        } catch (uploadErr) {
            console.error("Cloudinary upload failed:", uploadErr);
            return res.status(500).json({ message: "Image upload failed" });
        }
    } else {
        console.warn(" No profile image uploaded");
    }

    var newMessage = {
        sender: req.user._id,
        content: content || "",
        image: image || null,
        chat: chatId,
    }
    try {
        var message = await Message.create(newMessage);
        message = await Message.findById(message._id)
            .populate("sender", "name pic")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "name pic email",
                },
            });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
        res.status(200).json(message);

    } catch (error) {
        res.status(500).send(error.message || "Error Occured");
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).send(error.message || "Error Occured");
    }
});

export { sendMessage, allMessages };
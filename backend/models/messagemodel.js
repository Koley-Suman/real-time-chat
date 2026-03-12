import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, trim: true },
        image: { type: String },
        chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        deliveredTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;

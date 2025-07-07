import mongoose,{ Schema,Types } from "mongoose";

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, trim: true },
        image: { type: String },
        chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;

import mongoose,{ Schema, Types } from "mongoose";
//chatname
//isGroupChat
//users
// latestMessage
//groupAdmin


const chatSchema = new Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
        latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
        groupAdmin: { type: Types.ObjectId, ref: "User" },
        groupPic:{
            type: String,
            default:
                "",
        }
    },
    {
        timestamps: true
    }
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
import { createSlice } from "@reduxjs/toolkit";
import { allMessages, sendMessage } from "./messageThank";

interface messageType {
  _id: string;

  sender: {
    _id: string;
    name: string;
    email: string;
    pic: string | null;
  };

  content?: string;

  image?: string | null;

  chat: {
    _id: string;
  };

  deliveredTo: string[];

  seenBy: string[];
  status: "uploading" | "failed" | "sent";

  createdAt: string;
  updatedAt: string;
}
interface MessageState {
  allMessages: messageType[];
  imgLoad: boolean;
}

const initialState: MessageState = {
  allMessages: [],
  imgLoad: false,
};

const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.allMessages.push(action.payload);
    },
    updateDelivered(state, action) {
      const { messageId, userId } = action.payload;

      console.log("updateDelivered reducer", messageId, userId);

      const message = state.allMessages.find(
        (m) => m._id.toString() === messageId.toString(),
      );

      if (!message) return;

      if (!message.deliveredTo) {
        message.deliveredTo = [];
      }

      if (!message.deliveredTo.includes(userId)) {
        message.deliveredTo.push(userId);
      }
    },
    updateSeen(state, action) {
      const { chatId, userId } = action.payload;

      state.allMessages.forEach((msg) => {
        if (msg.chat._id === chatId) {
          if (!msg.seenBy) {
            msg.seenBy = [];
          }

          if (!msg.seenBy.includes(userId)) {
            msg.seenBy.push(userId);
          }
        }
      });
    },
    replaceTempMessage(state, action) {
      const { tempId, realMessage } = action.payload;

      const index = state.allMessages.findIndex((msg) => msg._id === tempId);

      if (index !== -1) {
        state.allMessages[index] = realMessage;
      }
    },
    uploadFailed(state, action) {
      const { messageId } = action.payload;

      const message = state.allMessages.find((m) => m._id === messageId);

      if (message) {
        message.status = "failed";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allMessages.fulfilled, (state, action) => {
        state.allMessages = action.payload;
      })
      .addCase(allMessages.rejected, (state, action) => {
        state.allMessages = [];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // state.allMessages.push(action.payload);
        state.imgLoad = false;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.imgLoad = true;
      });
  },
});
export const { addMessage, updateDelivered, updateSeen, replaceTempMessage, uploadFailed } =
  MessageSlice.actions;

export default MessageSlice.reducer;

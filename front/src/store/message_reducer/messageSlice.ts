import { createSlice } from "@reduxjs/toolkit";
import { allMessages, sendMessage } from "./messageThank";

interface messageType {
  allMessages: {
    sender: {
      _id: string;
      name: string;
      email: string;
      pic: string | null;
    };
    content: string;
    timestamp: string;
  }[];
  imgLoad: boolean;
}

const initialState: messageType = {
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
        state.allMessages.push(action.payload);
        state.imgLoad = false;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.imgLoad = true;
      });
  },
});
export const { addMessage} = MessageSlice.actions;

export default MessageSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import {
  addtoGroup,
  createChat,
  createNewGroup,
  fetchAllChats,
  removeTogroup,
} from "./chatThank";

interface chatType {
  allChat: {
    chatName: string | null;
    isGroupChat: boolean;
    users: {
      _id: string;
      name: string;
      email: string;
      pic: string | null;
    }[];
    latestMessage: {
      sender: {
        _id: string;
        name: string;
        email: string;
        pic: string | null;
      };
      content: string;
      timestamp: string;
    } | null;
    unreadCount: number;
    _id: string;
    groupAdmin: {
      _id: string;
      name: string;
      email: string;
      pic: string | null;
    } | null;
  }[];
  loading: boolean;
}

const initialState: chatType = {
  allChat: [],
  loading: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increaseUnread(state, action) {
      const { chatId } = action.payload;
      console.log("increaseUnread reducer", chatId);
      const chat = state.allChat.find((c) => c._id === chatId);

      if (chat) {
        chat.unreadCount = (chat.unreadCount || 0) + 1;
      }
    },

    clearUnread(state, action) {
      const { chatId } = action.payload;

      const chat = state.allChat.find((c) => c._id === chatId);

      if (chat) {
        chat.unreadCount = 0;
      }
    },
    addLastMessage(state, action) {
      const { chatId, message } = action.payload;
      console.log("addLastMessage reducer", chatId, message);
      const chatIndex = state.allChat.findIndex((c) => c._id === chatId);

      if (chatIndex === -1) return;

      const chat = state.allChat[chatIndex];

      chat.latestMessage = message;

      state.allChat.splice(chatIndex, 1);
      state.allChat.unshift(chat);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.allChat = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllChats.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.allChat = [];
        state.loading = false;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.allChat.push(action.payload);
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.allChat.push(action.payload);
      })
      .addCase(addtoGroup.fulfilled, (state, action) => {
        // Find the updated group in allChat and replace it
        const updatedGroup = action.payload;
        const idx = state.allChat.findIndex(
          (chat) => chat._id === updatedGroup._id,
        );
        if (idx !== -1) {
          state.allChat[idx] = updatedGroup;
        }
      })
      .addCase(removeTogroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const idx = state.allChat.findIndex(
          (chat) => chat._id === updatedGroup._id,
        );
        if (idx !== -1) {
          state.allChat[idx] = updatedGroup;
        }
      });
  },
});
export const { increaseUnread, clearUnread, addLastMessage } =
  chatSlice.actions;

export default chatSlice.reducer;

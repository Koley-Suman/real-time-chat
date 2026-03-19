import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from "../user_reducer/userSlice";
import axios from "axios";

const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (
    {
      chatId,
      content,
      image,
      onProgress,
    }: {
      chatId: string;
      content?: string;
      image?: any;
      onProgress?: (percent: number) => void;
    },
    { getState, rejectWithValue },
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      if (content?.trim()) {
        formData.append("content", content.trim());
      }
      if (image) {
        formData.append("image", image);
      }
      const response = await axios.post("/api/message/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          //  "Content-Type": "multipart/form-data"
        },
        // body: formData,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? progressEvent.loaded;

          const percent = Math.round((progressEvent.loaded * 100) / total);

          console.log("UPLOAD PROGRESS:", percent);

          onProgress?.(percent);
        },
      });
      return response.data;
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   return rejectWithValue(errorData.message || "Failed to send message");
      // }
      // return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

const allMessages = createAsyncThunk(
  "user/allmessage",
  async (id, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const response = await fetch(`/api/message/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch message");
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

export { allMessages, sendMessage };

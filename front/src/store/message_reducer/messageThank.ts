import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from "../user_reducer/userSlice";

const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (
    {
      chatId,
      content,
      image,
    }: { chatId: string; content?: string; image?: any },
    { getState, rejectWithValue }
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
      const response = await fetch("/api/message/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to send message");
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
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
  }
);

export {allMessages,sendMessage};
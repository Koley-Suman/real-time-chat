import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from "../user_reducer/userSlice";

const createChat = createAsyncThunk(
  "user/createChat",
  async (userId: { userId: string }, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userId),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to create chat");
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const fetchAllChats = createAsyncThunk(
  "user/fetchAllChats",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    console.log(token);

    try {
      const response = await fetch("/api/chat/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch chats");
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
const createNewGroup = createAsyncThunk(
  "user/createGroup",
  async (
    { name, users, groupPic }: { name: string; users: any[]; groupPic: any },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append(
        "users",
        JSON.stringify(users.map((u) => (typeof u === "string" ? u : u._id)))
      );
      formData.append("groupPic", groupPic);
      const response = await fetch(`/api/chat/group`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to create group");
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
const addtoGroup = createAsyncThunk(
  "chat/addtogroup",
  async (
    { chatId, users }: { chatId: string; users: any[] },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const response = await fetch(`/api/chat/groupadd`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId,
          userIds: users.map((u) => (typeof u === "string" ? u : u._id)),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to add user in group"
        );
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
const removeTogroup = createAsyncThunk(
  "chat/removeToGroup",
  async (
    { chatId, userId }: { chatId: string; userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const response = await fetch(`/api/chat/groupremove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to remove user in group"
        );
      }
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export {fetchAllChats,createChat,createNewGroup,addtoGroup,removeTogroup};
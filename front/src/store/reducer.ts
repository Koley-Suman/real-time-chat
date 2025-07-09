import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  pic: string | null;
  token?: string;
}
interface UserState {
  currentUser: CurrentUser | null;
  allChat: {
    chatName: string | null;
    isGroupChat: boolean;
    users: {
      _id: string;
      name: string;
      email: string;
      pic: string | null;
    }[];
    lastMessage: {
      sender: {
        _id: string;
        name: string;
        email: string;
        pic: string | null;
      };
      content: string;
      timestamp: string;
    } | null;
    _id: string;
    groupAdmin: {
      _id: string;
      name: string;
      email: string;
      pic: string | null;
    } | null;
  }[];
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
  searchUser: [];
  loading:boolean;
  imgLoad:boolean;
}

const signIn = createAsyncThunk(
  "user/signIn",
  async (userData: { email: string; password: string }) => {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
);

const signUp = createAsyncThunk(
  "user/signUp",
  async (userData: {
    name: string;
    email: string;
    password: string;
    pic: any;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("profilePic", userData.pic);
      const response = await fetch("/api/user/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle error status codes
        const errorData = await response.json();
        return errorData.message || "Signup failed";
      }
      return response.json();
    } catch (error: any) {
      console.error(error.message);
    }
  }
);
const fetchAllChats = createAsyncThunk(
  "user/fetchAllChats",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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

const allMessages = createAsyncThunk(
  "user/allmessage",
  async (id, { getState, rejectWithValue }) => {
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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
const createChat = createAsyncThunk(
  "user/createChat",
  async (userId: { userId: string }, { getState, rejectWithValue }) => {
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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

const contacts = createAsyncThunk(
  "user/search",
  async ({ text }: { text: string }, { getState, rejectWithValue }) => {
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
    try {
      const response = await fetch(`/api/user?search=${text}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to search contacts"
        );
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
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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
    const state = getState() as { userChat: UserState };
    const token = state.userChat.currentUser?.token;
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

// Define the initial state using that type
const initialState: UserState = {
  currentUser:
    typeof window !== "undefined" && localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")!)
      : null,
  allChat: [],
  allMessages: [],
  searchUser: [],
  loading:false,
  imgLoad:false
};

export const counterSlice = createSlice({
  name: "userChat",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addMessage(state, action) {
      state.allMessages.push(action.payload);
    },
    signout(state){
      state.currentUser=null;
      state.allChat=[];
      state.allMessages=[];
      state.searchUser=[];
      state.loading=false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = {
          ...action.payload.user,
          token: action.payload.token,
        };
        state.loading=false;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(signIn.pending,(state,action)=>{
        state.loading=true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.currentUser = null;
        state.loading=false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.currentUser = {
          ...action.payload.user,
          token: action.payload.token,
        };
        state.loading=false;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(signUp.pending,(state,action)=>{
        state.loading=true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.currentUser = null;
        state.loading=false;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.allChat = action.payload;
        state.loading=false;
      })
      .addCase(fetchAllChats.pending, (state, action) => {
        state.loading=true;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.allChat = [];
        state.loading=false;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.allChat.push(action.payload);
      })
      .addCase(allMessages.fulfilled, (state, action) => {
        state.allMessages = action.payload;
      })
      .addCase(allMessages.rejected, (state, action) => {
        state.allMessages = [];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.allMessages.push(action.payload);
        state.imgLoad=false;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.imgLoad=true;
      })
      .addCase(contacts.fulfilled, (state, action) => {
        state.searchUser = action.payload;
      })
      .addCase(contacts.rejected, (state, action) => {
        state.searchUser = [];
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.allChat.push(action.payload);
      })
      .addCase(addtoGroup.fulfilled, (state, action) => {
        // Find the updated group in allChat and replace it
        const updatedGroup = action.payload;
        const idx = state.allChat.findIndex(
          (chat) => chat._id === updatedGroup._id
        );
        if (idx !== -1) {
          state.allChat[idx] = updatedGroup;
        }
      })
      .addCase(removeTogroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const idx = state.allChat.findIndex(
          (chat) => chat._id === updatedGroup._id
        );
        if (idx !== -1) {
          state.allChat[idx] = updatedGroup;
        }
      });
  },
});

// Export async thunks directly
export const { addMessage,signout } = counterSlice.actions;
export {
  signIn,
  signUp,
  fetchAllChats,
  createChat,
  allMessages,
  sendMessage,
  contacts,
  createNewGroup,
  addtoGroup,
  removeTogroup,
};

export default counterSlice.reducer;

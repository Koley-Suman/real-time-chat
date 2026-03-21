import { createSlice } from "@reduxjs/toolkit";
import {
  contacts,
  signIn,
  signUp,
  updateProfile,
  uploadPic,
} from "./userThank";

// Define a type for the slice state
interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  pic: string | null;
  token?: string;
  bio: string;
}
export interface UserState {
  currentUser: CurrentUser | null;
  searchUser: [];
  loading: boolean;
  error: string | null;
}

const getInitialUser = (): CurrentUser | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          // Decode the middle token part
          const payloadStr = atob(user.token.split('.')[1]);
          const payload = JSON.parse(payloadStr);
          // Check expiration
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("currentUser");
            return null;
          }
          return user;
        }
        return user;
      } catch (error) {
        localStorage.removeItem("currentUser");
        return null;
      }
    }
  }
  return null;
};

const initialState: UserState = {
  currentUser: getInitialUser(),
  searchUser: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = {
          ...action.payload.user,
          token: action.payload.token,
        };
        state.loading = false;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(signIn.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.currentUser = null;
        state.loading = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.currentUser = {
          ...action.payload.user,
          token: action.payload.token,
        };
        state.loading = false;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.currentUser = null;
        state.loading = false;
      })
      .addCase(uploadPic.fulfilled, (state, action) => {
        state.currentUser = {
          ...action.payload.user,
          token: action.payload.token,
        };
        state.loading = false;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(uploadPic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(uploadPic.rejected, (state) => {
        state.loading = false;
      })
      .addCase(contacts.fulfilled, (state, action) => {
        state.searchUser = action.payload;
      })
      .addCase(contacts.rejected, (state, action) => {
        state.searchUser = [];
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        console.log("Profile updated in slice:", action.payload);
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            name: action.payload.name,
            bio: action.payload.bio,
            pic: action.payload.pic,
          };

          localStorage.setItem(
            "currentUser",
            JSON.stringify(state.currentUser),
          );
        }
      });
  },
});
export const { signout } = userSlice.actions;
export default userSlice.reducer;

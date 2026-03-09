import { createSlice } from "@reduxjs/toolkit";
import { contacts, signIn, signUp, uploadPic } from "./userThank";

// Define a type for the slice state
interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  password:string;
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

const initialState: UserState = {
  currentUser:
    typeof window !== "undefined" && localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")!)
      : null,
  
  searchUser: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signout:() =>initialState,
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
      });
  },
});
export const {signout} = userSlice.actions;
export default userSlice.reducer;

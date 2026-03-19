import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";
import axios from "axios";

const signIn = createAsyncThunk(
  "user/signIn",
  async (userData: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    // console.log(response.json());
    const data = await response.json();
    console.log(data);
    
    return data;
    } catch (error) {
      console.log(error);
      
    }
    
  }
);

const signUp = createAsyncThunk(
  "user/signUp",
  async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch("/api/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Handle error status codes
        const errorData = await response.json();
        return errorData.message || "Signup failed";
      }
      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);
const uploadPic = createAsyncThunk(
  "user/uploadPic",
  async (
    userData: {
      pic: File;
      bio: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
    try {
      const formData = new FormData();
      formData.append("profilePic", userData.pic);
      formData.append("bio", userData.bio);
      const response = await fetch("api/user/uploadPic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch chats");
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        return data;
      }
    } catch (error:any) {
      console.log(error);
      return error.message;
    }
  }
);
const contacts = createAsyncThunk(
  "user/search",
  async ({ text }: { text: string }, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;
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


const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    userData: { name: string; pic: File | null; bio: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserState };
    const token = state.user.currentUser?.token;

    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("bio", userData.bio);

      if (userData.pic) {
        formData.append("profilePic", userData.pic);
      }

      const response = await axios.patch(
        "/api/user/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile update response:", response.data);
      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile"
      );
    }
  }
);

export {signIn,signUp,uploadPic,contacts,updateProfile}
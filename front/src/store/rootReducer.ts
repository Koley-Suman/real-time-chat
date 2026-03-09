import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './user_reducer/userSlice';
import chatReducer from "./chat_reducer/chatSlice";
import messageREducer from "./message_reducer/messageSlice";

const appReducer = combineReducers({
    user:userReducer,
    chat:chatReducer,
    message:messageREducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "user/signout") {
    return appReducer({ ...state, user: undefined }, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
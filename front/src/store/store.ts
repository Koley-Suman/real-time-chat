import { configureStore } from '@reduxjs/toolkit'

import userReducer from './reducer'

const store = configureStore({
  reducer: {
    userChat: userReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

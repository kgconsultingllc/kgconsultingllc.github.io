import { configureStore } from '@reduxjs/toolkit'
import file from "./components/FileSlice";

export const store = configureStore({
  reducer: {
    file: file
  }
})

// // Inferred type: posts: PostsState, comments: CommentsState, users: UsersState}{
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

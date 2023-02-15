import { configureStore } from '@reduxjs/toolkit'
import file from "./components/FileSlice";
import chart from "./components/ChartSlice";

export const store = configureStore({
  reducer: {
    file: file,
    chart: chart
  }
})

// // Inferred type: posts: PostsState, comments: CommentsState, users: UsersState}{
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

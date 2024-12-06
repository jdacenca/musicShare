import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  isDarkMode: false,
  posts: [],
  trendingMusic: [],
  recommendations: [],
  authToken: null,
  currentUser: null,
  openPopup: null,
  createPostData: {
    text: "",
  },
};

const appSlice = createSlice({
  name: "beatSnapApp",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setTrendingMusic: (state, action) => {
      state.trendingMusic = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setOpenPopup: (state, action) => {
      state.openPopup = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setCreatePostData: (state, action) => {
      state.createPostData = action.payload;
    },
    clearCreatePostData: (state) => {
      state.createPostData = { text: "", attachments: [] };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
        return initialState;
    });
}
});

export const {
  toggleDarkMode,
  setPosts,
  setTrendingMusic,
  setRecommendations,
  setAuthToken,
  setCurrentUser,
  setOpenPopup,
  setCreatePostData,
  setFollowing,
  clearCreatePostData,
} = appSlice.actions;

export default appSlice.reducer;

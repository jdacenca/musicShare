import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  isDarkMode: false,
  posts: [],
  trendingMusic: [],
  recommendations: [],
  notifications: [],
  authToken: null,
  currentUser: null,
  openPopup: null,
  createPostData: {
    text: "",
  },
  following: [],
  liveData: null,
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
    setLiveData: (state, action) => {
      state.liveData = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
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
    setUnfollowing: (state, action) => {
      state.following = state.following.filter(user => user.following_id !== action.payload);
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
  setNotifications,
  setAuthToken,
  setCurrentUser,
  setOpenPopup,
  setCreatePostData,
  setFollowing,
  setUnfollowing,
  clearCreatePostData,
  setLiveData
} = appSlice.actions;

export default appSlice.reducer;

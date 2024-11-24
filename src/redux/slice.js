import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  trendingMusic: [],
  authToken: null,
  currentUser: null,
  openPopup: null,
  createPostData: {
    text: ''
  },
};

const appSlice = createSlice({
  name: 'beatSnapApp',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTrendingMusic: (state, action) => {
      state.trendingMusic = action.payload;
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
    setCreatePostData: (state, action) => {
      state.createPostData = action.payload;
    },
    clearCreatePostData: (state) => {
      state.createPostData = { text: '', attachments: [] };
    },
  },
});

export const {
  toggleDarkMode,
  setTrendingMusic,
  setAuthToken,
  setCurrentUser,
  setOpenPopup,
  setCreatePostData,
  clearCreatePostData,
} = appSlice.actions;

export default appSlice.reducer;
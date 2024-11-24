import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slice";

const beatSnapStore = configureStore({
  reducer: {
    beatSnapApp: appReducer,
  },
});

export default beatSnapStore;

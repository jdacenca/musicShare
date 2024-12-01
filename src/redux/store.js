import { configureStore } from "@reduxjs/toolkit";
import beatSnapAppReducer from "./slice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, beatSnapAppReducer);

export const beatSnapStore = configureStore({
  reducer: {
    beatSnapApp: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(beatSnapStore);

/*const beatSnapStore = configureStore({
  reducer: {
    beatSnapApp: appReducer,
  },
});*/

// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, REHYDRATE, FLUSH, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import projectReducer from "./projectSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  project: projectReducer,
});

const persistConfig = {
  key: "root",
  storage,
  timeout: 10000,
  serialize: true,
  debug: false,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

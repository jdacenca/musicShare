import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App.jsx";
import { beatSnapStore, persistor } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={beatSnapStore}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

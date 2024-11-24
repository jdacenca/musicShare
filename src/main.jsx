import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import beatSnapStore from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={beatSnapStore}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);

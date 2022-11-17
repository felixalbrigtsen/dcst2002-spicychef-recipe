import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AlertProvider from "./hooks/Alert";
import LoginProvider from "./hooks/Login";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AlertProvider>
      <LoginProvider>
        <App />
      </LoginProvider>
    </AlertProvider>
  </React.StrictMode>
);

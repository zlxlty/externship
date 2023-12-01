import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SWRConfig } from "swr";
import localStorageProvider from "./utils/localStorageProvider.js";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="798543765378-6hd1vtplvh1frdr05gv2tei925nao7h3.apps.googleusercontent.com">
      <SWRConfig value={{ provider: localStorageProvider }}>
        <App />
      </SWRConfig>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

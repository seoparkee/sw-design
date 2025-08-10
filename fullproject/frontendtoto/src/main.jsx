import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // 이 App은 루트 App.jsx (라우팅 포함)
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
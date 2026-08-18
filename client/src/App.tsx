// import { useEffect, useState } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useUserStore } from "./store/authStore";
import "./App.css";
import WorkspacesListPage from "./pages/WorkspacesListPage";
import WorkspacePage from "./pages/WorkspacePage";
import { useEffect } from "react";
import { socket } from "./api/socket";
 
function App() {
useEffect(() => {
  console.log("App component mounted! Socket connected?", socket.connected);

  const handleConnect = () => {
    console.log("Connected to server! Socket ID:", socket.id);
    socket.emit("hello", { message: "I am the frontend!" });
  };

  const handleWelcome = (data: any) => {
    console.log("Server says:", data.message);
  };

  const handleDisconnect = (reason: string) => {
    console.log("Socket disconnected. Reason:", reason);
  };

  const handleConnectError = (error: Error) => {
    console.error("Socket connection error:", error.message);
  };

  // 1. Attach listeners FIRST
  socket.on("connect", handleConnect);
  socket.on("welcome", handleWelcome);
  socket.on("disconnect", handleDisconnect);
  socket.on("connect_error", handleConnectError);

  // 2. Then connect
  if (!socket.connected) {
    console.log("🔄 Calling socket.connect()...");
    socket.connect();
  } else {
    // If HMR kept the socket alive
    handleConnect(); 
  }

  // 3. Cleanup listeners on unmount
  return () => {
  socket.removeAllListeners();
  };
}, []);


  const isAuth = useUserStore((state) => state.isAuthenticated);
  // const username = useUserStore((state)=> state.user?.username);
  return (
    <>
      <BrowserRouter>
        
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route
            path="/login"
            element={
              !isAuth ? <LoginPage /> : <Navigate to="/workspaces" replace />
            }
          />
          <Route
            path="/register"
            element={
              !isAuth ? <RegisterPage /> : <Navigate to="/workspaces" replace />
            }
          />

          {/* PROTECTED ROUTES */}

          <Route
            path="/workspaces"
            element={
              isAuth ? <WorkspacesListPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/workspace/:id"
            element={
              isAuth ? <WorkspacePage /> : <Navigate to="/login" replace />
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate to={isAuth ? "/workspaces" : "/login"} replace />
            }
          />
        </Routes>
        {/* </MainLayout> */}
      </BrowserRouter>
    </>
  );
}

export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "./App.css";
import ChatroomList from "./components/ChatroomList";
import Chatroom from "./components/Chatroom";
import { RecoilRoot } from "recoil";
import useInitializeAuth from "./hooks/useInitializeAuth";

const App = () => {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ChatroomList />} />
        <Route path="/chatroom/:chatroomId" element={<Chatroom />} />
        <Route path="/login" element={<Login email="" password="" />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "./App.css";
import ChatroomList from "./components/ChatroomList";
import { RecoilRoot } from "recoil";
import ChatroomPage from "./components/pages/ChatroomPage";
import MyChatroomList from "./components/MyChatroomList";

const App = () => {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
};

const AppContent = () => {
  return (
    <BrowserRouter basename="/">
      <Header />
      <Routes>
        <Route path="/my-chatrooms" element={<MyChatroomList />} />
        <Route path="/create-chatroom" element={<>hello</>} />
        <Route path="/" element={<ChatroomList />} />
        <Route path="/chatroom/:chatroomId" element={<ChatroomPage />} />
        <Route path="/login" element={<Login email="" password="" />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

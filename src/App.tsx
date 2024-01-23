import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./header/Header";
import Footer from "./header/Footer";
import "./App.css";
import { UserProvider } from "./reducer/UserContext";
import ChatroomList from "./components/ChatroomList";
import Chatroom from "./components/Chatroom";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ChatroomList />} />
          <Route path="/chatroom/:chatroomId" element={<Chatroom />} />
          <Route path="/login" element={<Login email="" password="" />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
        <Footer />
      </UserProvider>
    </Router>
  );
};

export default App;

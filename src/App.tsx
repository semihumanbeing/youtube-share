import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import HeaderComponent from "./header/HeaderComponent";
import FooterComponent from "./header/FooterComponent";
import "./App.css";
import { UserProvider } from "./context/UserContext";
import ChatroomList from "./components/ChatroomList";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<ChatroomList />} />
          <Route
            path="/login"
            element={<LoginComponent email="" password="" />}
          />
          <Route path="/signup" element={<RegisterComponent />} />
        </Routes>
        <FooterComponent />
      </UserProvider>
    </Router>
  );
};

export default App;

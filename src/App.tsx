import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import HeaderComponent from "./header/HeaderComponent";
import FooterComponent from "./header/FooterComponent";
import "./App.css";

const App = () => {
  return (
    <Router>
      <HeaderComponent />
      <Routes>
        <Route
          path="/login"
          element={<LoginComponent email="" password="" />}
        />
        <Route path="/signup" element={<RegisterComponent />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
};

export default App;

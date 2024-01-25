import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";

const LogoutHandler = () => {
  const navigate = useNavigate();
  const [, setUser] = useRecoilState(userState);

  const handleLogout = async () => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (!user || !accessToken) {
      clearLocalStorageAndNavigate();
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Logout Success:", data);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearLocalStorageAndNavigate();
    }
  };

  const clearLocalStorageAndNavigate = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutHandler;

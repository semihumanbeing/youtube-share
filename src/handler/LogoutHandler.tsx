import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";

const LogoutHandler = () => {
  const navigate = useNavigate();
  const [, setUser] = useRecoilState(userState);

  const handleLogout = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      clearLocalStorageAndNavigate();
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearLocalStorageAndNavigate();
    }
  };

  const clearLocalStorageAndNavigate = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      logout
    </button>
  );
};

export default LogoutHandler;

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const useInitializeAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const isTokenExpired = (token: string) => {
    try {
      const decoded: { exp?: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return (decoded?.exp ?? 0) < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/user/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid refresh token");
        }
        const data = response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((error: any) => {
        console.error("Error refreshing token", error);
        handleLogout();
        return;
      });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      handleLogout();
      return;
    }
    const user = JSON.parse(userString);
    const accessToken = user.accessToken;
    const refreshToken = user.refreshToken;

    if (user && accessToken) {
      if (!isTokenExpired(accessToken)) {
        setUser(user);
      } else if (isTokenExpired(accessToken) && refreshToken) {
        console.log("token expired but refreshtoken exists");
        refreshAccessToken(refreshToken);
      } else {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, []);
};

export default useInitializeAuth;

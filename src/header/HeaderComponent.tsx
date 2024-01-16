import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
      });
      setUser(null);
      navigate("/"); // 홈페이지로 리디렉션
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <h1 style={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}>
        YouTube Share
      </h1>
      <div>
        {!user || !user.userId ? (
          <>
            <Link to="/login" className="user-link">
              로그인
            </Link>
            <Link to="/signup" className="user-link">
              회원가입
            </Link>
          </>
        ) : (
          <button onClick={handleLogout}>로그아웃</button>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../reducer/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/api/user/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        <Link to="/" className="user-link">
          YouTube Share
        </Link>
      </h1>
      <div>
        {!user || !user.accessToken ? (
          <div className="header">
            <Link to="/login" className="user-link">
              로그인
            </Link>
            <Link to="/signup" className="user-link">
              회원가입
            </Link>
          </div>
        ) : (
          <div className="header">
            {"Hello, "}
            {user.username}{" "}
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

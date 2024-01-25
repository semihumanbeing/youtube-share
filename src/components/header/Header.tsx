import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../state/states";
import LogoutHandler from "../../handler/LogoutHandler";
import useInitializeAuth from "../../hooks/useInitializeAuth";

const Header = () => {
  const [user] = useRecoilState(userState);

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
            {user.username}
            <LogoutHandler />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

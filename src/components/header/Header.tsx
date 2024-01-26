import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../state/states";
import LogoutHandler from "../../handler/LogoutHandler";
import useInitializeAuth from "../../hooks/useInitializeAuth";

const Header = () => {
  const [user] = useRecoilState(userState);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleRefresh = (e: any) => {
    e.preventDefault();
    window.location.replace("/youtube-share");
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
      <h1
        style={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}
        className="user-link"
        onClick={handleRefresh}
      >
        YouTube Share
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
            <button
              className="header-button"
              onClick={() => setIsMenuVisible(!isMenuVisible)}
            >
              {"Hello, "}
              {user.username}
            </button>
            {isMenuVisible && (
              <div className="dropdown-menu">
                <Link to="/my-chatrooms" className="dropdown-item">
                  내 채팅방 보기
                </Link>
                <Link to="/create-chatroom" className="dropdown-item">
                  채팅방 만들기
                </Link>
              </div>
            )}
            <LogoutHandler />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

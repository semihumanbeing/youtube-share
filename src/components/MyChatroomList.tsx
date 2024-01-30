import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordModal } from "./modal/PasswordModal";
import useInitializeAuth from "../hooks/useInitializeAuth";

interface Chatroom {
  chatroomId: number;
  emoji: string;
  chatroomName: string;
  userCount: number;
  maxUserCount: number;
  hasPwd: boolean;
  username: string;
}

const MyChatroomList = () => {
  useInitializeAuth();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`http://localhost:8080/api/chatroom`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setChatrooms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching chatrooms:", error);
        });
    };

    fetchData();
  }, []);

  return (
    <div className="chatroom-container">
      {chatrooms.map((chatroom) => (
        <div
          key={chatroom.chatroomId}
          className="chatroom-block"
          onClick={() => {
            navigate(`/chatroom/${chatroom.chatroomId}`);
          }}
        >
          <div className="chatroom-emoji">{chatroom.emoji}</div>
          <div className="chatroom-name">{chatroom.chatroomName}</div>
          <span>
            {"("}
            {chatroom.userCount}/{chatroom.maxUserCount}
            {")"}
          </span>
          {chatroom.hasPwd && <span className="lock-icon">🔒</span>}
          <div className="chatroom-info">
            <span>By {chatroom.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default MyChatroomList;

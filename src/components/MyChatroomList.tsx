import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInitializeAuth from "../hooks/useInitializeAuth";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";

interface Chatroom {
  chatroomId: string;
  userId: number;
  username: string;
  emoji: string;
  chatroomName: string;
  userCount: number;
  maxUserCount: number;
  hasPwd: boolean;
  createdAt: string;
  updatedAt: string;
}

const MyChatroomList = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const navigate = useNavigate();
  const [user] = useRecoilState(userState);

  const handleDeleteChatroom = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    chatroomId: string
  ) => {
    e.preventDefault();
    useInitializeAuth();
    if (!confirm("삭제하시겠습니까?")) {
      return;
    }
    await fetch(`${process.env.REACT_APP_BASE_URL}/chatroom/${chatroomId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json)
      .then((response) => {
        console.log(chatroomId);
        const updatedChatrooms = chatrooms.filter(
          (chatroom) => chatroom.chatroomId !== chatroomId
        );
        setChatrooms(updatedChatrooms);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.REACT_APP_BASE_URL}/chatroom`, {
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
          {user && user.userId === chatroom.userId && (
            <button
              type="button"
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChatroom(e, chatroom.chatroomId);
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default MyChatroomList;

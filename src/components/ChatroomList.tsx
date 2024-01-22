import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Chatroom {
  chatroomId: number;
  userId: number;
  username: string;
  chatroomName: string;
  emoji: string;
  chatroomPassword: string;
  userCount: number;
  maxUserCount: number;
  hasPwd: boolean;
  createdAt: string;
  updatedAt: string;
}

const ChatroomList = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/api";
  const SIZE = 10;

  const fetchChatrooms = useCallback(
    (currentPage: number) => {
      if (!hasMore || loading) return;
      setLoading(true);
      fetch(`${BASE_URL}/chatroom/all?page=${page}&size=${SIZE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setChatrooms((prevChatrooms) => {
            const newChatrooms = result.data.content.filter(
              (newChatroom: Chatroom) =>
                !prevChatrooms.some(
                  (prevChatroom) =>
                    prevChatroom.chatroomId === newChatroom.chatroomId
                )
            );
            return [...prevChatrooms, ...newChatrooms];
          });
          setPage(currentPage + 1);
          setHasMore(!result.data.last);
        })
        .catch((error) => {
          console.error("Error fetching chatrooms:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [loading, hasMore]
  );

  // 초기 채팅방 로드
  useEffect(() => {
    fetchChatrooms(page);
  }, []);

  const loadMoreChatrooms = useCallback(() => {
    fetchChatrooms(page);
  }, [page, fetchChatrooms]);

  const handleScroll = useCallback((): void => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const { scrollTop } = document.documentElement;

    if (
      Math.round(scrollTop + innerHeight) >= scrollHeight &&
      !loading &&
      hasMore
    ) {
      loadMoreChatrooms();
    }
  }, [page, loading, hasMore, fetchChatrooms]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="chatroom-container">
      {chatrooms.map((chatroom) => (
        <div
          key={chatroom.chatroomId}
          className="chatroom-block"
          //onClick={() => navigate(`/chatroom/${chatroom.chatroomId}`)}
        >
          <div className="chatroom-emoji">{chatroom.emoji}</div>
          <div className="chatroom-name">{chatroom.chatroomName}</div>
          <span>
            {"("}
            {chatroom.userCount}/{chatroom.maxUserCount}
            {")"}
          </span>
          <div className="chatroom-info">
            <span>By {chatroom.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;

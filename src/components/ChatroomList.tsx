import React, { useState, useEffect, useCallback } from "react";

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
  const BASE_URL = "http://localhost:8080/api";
  const SIZE = 10;

  const fetchChatrooms = useCallback(
    (pageNum: number) => {
      if (!hasMore || loading) return;
      setLoading(true);
      fetch(`${BASE_URL}/chatroom/all?page=${pageNum}&size=${SIZE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setChatrooms((prevChatrooms) => [
            ...prevChatrooms,
            ...data.data.content,
          ]);
          setPage(pageNum + 1);
          setHasMore(data.data.content.length > 0);
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
        <div key={chatroom.chatroomId} className="chatroom-block">
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

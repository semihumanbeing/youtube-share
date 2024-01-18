import React, { useState, useEffect, useCallback } from "react";

interface Chatroom {
  chatroomId: number;
  userId: number;
  username: string;
  chatroomName: string;
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
  const BASE_URL = "http://localhost:8080/api";

  const emojis = [
    "🐶",
    "🐱",
    "🦁",
    "🐵",
    "🦊",
    "🐰",
    "🦜",
    "🐢",
    "🐠",
    "🦄",
    "👫",
    "👭",
    "👬",
    "💬",
    "📢",
    "🤳",
  ];

  const getRandomEmoji = () =>
    emojis[Math.floor(Math.random() * emojis.length)];

  const fetchChatrooms = useCallback(
    (pageNum: number) => {
      // 이미 더 로드할 데이터가 없는 경우 API 호출을 하지 않음
      if (!hasMore) return;
      if (hasMore) {
        fetch(`${BASE_URL}/chatroom/all?page=${pageNum}&size=30`, {
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
            setPage((prevPage) => prevPage + 1);
            setHasMore(data.data.content.length > 0);
          })
          .catch((error) => {
            console.error("Error fetching chatrooms:", error);
          });
      }
    },
    [hasMore]
  );

  const loadMoreChatrooms = useCallback(() => {
    fetchChatrooms(page);
  }, [page, fetchChatrooms]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight ||
        !hasMore
      )
        return;
      loadMoreChatrooms();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadMoreChatrooms]);

  // 초기 채팅방 로드
  useEffect(() => {
    fetchChatrooms(1);
  }, [fetchChatrooms]);

  return (
    <div className="chatroom-container">
      {chatrooms.map((chatroom) => (
        <div key={chatroom.chatroomId} className="chatroom-block">
          <div className="chatroom-emoji">{getRandomEmoji()}</div>
          <div className="chatroom-name">{chatroom.chatroomName}</div>
          <span>
            {"("}
            {chatroom.userCount}/{chatroom.maxUserCount}
            {")"}
          </span>
          <div className="chatroom-info">
            <span>{chatroom.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;

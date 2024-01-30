import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordModal } from "./modal/PasswordModal";

interface Chatroom {
  chatroomId: string;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/api/chatroom";
  const SIZE = 12;

  const fetchChatrooms = useCallback(
    (currentPage: number) => {
      if (!hasMore || loading) return;
      setLoading(true);
      fetch(`${BASE_URL}/all?page=${page}&size=${SIZE}`, {
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
    [page, loading, hasMore]
  );

  const handlePasswordConfirm = (password: string) => {
    if (selectedChatroom && password === selectedChatroom.chatroomPassword) {
      navigate(`/chatroom/${selectedChatroom.chatroomId}`);
    } else {
      alert("Incorrect password.");
      return;
    }
    setIsModalOpen(false);
  };

  // 초기 채팅방 로드
  useEffect(() => {
    fetchChatrooms(page);
  }, []);

  // 스크롤이 화면 아래에 도달할 시 다음 페이지 불러오기
  const loadMoreChatrooms = useCallback(() => {
    fetchChatrooms(page);
  }, [page]);

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
          onClick={() => navigate(`/chatroom/${chatroom.chatroomId}`)}
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
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePasswordConfirm}
      />
    </div>
  );
};

export default ChatroomList;

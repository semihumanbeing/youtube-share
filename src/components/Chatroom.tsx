import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";
import useInitializeAuth from "../hooks/useInitializeAuth";

interface ChatMessage {
  chatroomId: string;
  username: string;
  message: string;
}

const Chatroom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState<any>(null);
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [user] = useRecoilState(userState);

  useInitializeAuth();

  useEffect(() => {
    const client = Stomp.over(
      () => new SockJS(`${process.env.REACT_APP_WS_URL}`)
    );

    client.connect({}, () => {
      client.send(
        `/pub/chatroom/${chatroomId}/connect`,
        {},
        JSON.stringify({ username: user.username })
      );
      client.subscribe(
        `/sub/chat/room/${chatroomId}`,
        (response: { body: string }) => {
          const chatMessage: ChatMessage = JSON.parse(response.body);
          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        }
      );
    });

    setClient(client);

    return () => {
      client.disconnect(() => {
        console.log("Disconnected");
      });
    };
  }, [chatroomId]);

  const sendMessage = (): void => {
    if (!newMessage.trim() || !user || !chatroomId) {
      return;
    }

    const msg: ChatMessage = {
      chatroomId,
      username: user.username,
      message: newMessage,
    };

    client.send(`/pub/chat/message`, {}, JSON.stringify(msg));
    setNewMessage("");
  };

  // 메시지 발생 시 제일 아래의 메시지로 스크롤
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messageEndRef.current != null) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 새로고침 막기
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg.username}: {msg.message}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <div>
        <input
          className="chat-input"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing === false && e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type your message here"
        />
        <button
          className="chat-button"
          onClick={(e) => {
            e.stopPropagation();
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatroom;

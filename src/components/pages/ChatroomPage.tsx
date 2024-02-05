import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);
  const { state } = useLocation();
  const chatroom = state && state.chatroom;

  useEffect(() => {
    setIsWindow(true);
  }, []);

  return (
    <>
      <div className="chatroom-info">
        <h1 className="chatroom-name">
          {chatroom ? chatroom.chatroomName : ""}
        </h1>
      </div>

      <div className="chatroom-page">
        <div className="video-player">{isWindow && <VideoPlayer />}</div>
        <div className="chatroom">
          <Chatroom />
        </div>
      </div>
    </>
  );
};

export default ChatroomPage;

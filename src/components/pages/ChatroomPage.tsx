import React, { useEffect, useState } from "react";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);

  useEffect(() => {
    setIsWindow(true);
  }, []);

  return (
    <div className="chatroom-page">
      <h2></h2>
      <div className="video-player">{isWindow && <VideoPlayer />}</div>
      <div className="chatroom">
        <Chatroom />
      </div>
    </div>
  );
};

export default ChatroomPage;

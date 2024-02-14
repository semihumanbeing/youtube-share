import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";
import useInitializeAuth from "../../hooks/useInitializeAuth";
import Playlist from "../Playlist";
import VideoModal from "../modal/VideoModal";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);
  const { state } = useLocation();
  const chatroom = state && state.chatroom;
  const chatroomId = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  useInitializeAuth();

  useEffect(() => {
    setIsWindow(true);
  }, []);

  function changeModalStatus(): void {
    setModalVisible((prevModalVisible) => !prevModalVisible);
  }
  return (
    <>
      <div className="chatroom-info">
        <h1 className="page-chatroom-name">
          {chatroom ? chatroom.chatroomName : ""}
        </h1>
      </div>

      <div className="chatroom-page">
        <div className="video-player">{isWindow && <VideoPlayer />}</div>

        <div className="playlist">
          {isWindow && <Playlist chatroomId={chatroomId.chatroomId} />}
        </div>
      </div>
      <button className="add-video-button" onClick={changeModalStatus}>
        Add video
      </button>
      <div className="chatroom">
        <Chatroom />
      </div>
      {modalVisible && <VideoModal onCloseModal={changeModalStatus} />}
    </>
  );
};

export default ChatroomPage;

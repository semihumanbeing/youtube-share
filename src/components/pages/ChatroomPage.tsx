import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";
import useInitializeAuth from "../../hooks/useInitializeAuth";
import Playlist from "../Playlist";
import VideoModal from "../modal/VideoModal";
import { VideoProps } from "../../props/VideoProps";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);
  const { state } = useLocation();
  const chatroom = state && state.chatroom;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProps>();
  const { chatroomId } = useParams<{ chatroomId: string }>();

  useInitializeAuth();

  useEffect(() => {
    setIsWindow(true);
  }, []);

  const changeModalStatus = () => {
    setModalVisible((prevModalVisible) => !prevModalVisible);
  };

  const onSelectVideo = (video: VideoProps): void => {
    if (video) {
      setSelectedVideo(video);
    }
  };

  return (
    <>
      <div className="chatroom-info">
        <h1 className="page-chatroom-name">
          {chatroom ? chatroom.chatroomName : ""}
        </h1>
      </div>

      <div className="chatroom-page">
        <div className="playlist">
          {isWindow && chatroomId && <Playlist selectedVideo={selectedVideo} />}
        </div>
        <div className="video-player">{isWindow && <VideoPlayer />}</div>
      </div>
      <div className="video-buttons">
        <button className="add-video-button" onClick={changeModalStatus}>
          Add More
        </button>
      </div>
      <div className="chatroom">
        <Chatroom />
      </div>
      {modalVisible && (
        <VideoModal
          onCloseModal={changeModalStatus}
          onSelectVideo={onSelectVideo}
        />
      )}
    </>
  );
};

export default ChatroomPage;

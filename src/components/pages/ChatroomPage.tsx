import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";
import useInitializeAuth from "../../hooks/useInitializeAuth";
import Playlist from "../Playlist";
import VideoModal from "../modal/VideoModal";
import { VideoProps } from "../../props/VideoProps";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);
  const { state } = useLocation();
  const chatroom = state && state.chatroom;
  const param = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProps>();

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

  const onPlay = () => {
    const client = Stomp.over(
      () => new SockJS(`${process.env.REACT_APP_WS_URL}`)
    );

    client.connect({}, () => {
      client.send(
        `/pub/video/current`,
        {},
        JSON.stringify({ chatroomId: chatroom.chatroomId })
      );
    });
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
          {isWindow && param.chatroomId && (
            <Playlist selectedVideo={selectedVideo} />
          )}
        </div>
        <div className="video-player">{isWindow && <VideoPlayer />}</div>
      </div>
      <div className="video-buttons">
        <button className="add-video-button" onClick={onPlay}>
          Play!
        </button>
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

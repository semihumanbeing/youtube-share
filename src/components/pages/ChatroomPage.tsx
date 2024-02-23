import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ChatroomPage.css";
import Chatroom from "../Chatroom";
import VideoPlayer from "../VideoPlayer";
import useInitializeAuth from "../../hooks/useInitializeAuth";
import Playlist from "../Playlist";
import VideoModal from "../modal/VideoModal";
import { VideoProps } from "../../props/VideoProps";

const ChatroomPage = () => {
  const [isWindow, setIsWindow] = useState<boolean>(false);
  const { state } = useLocation();
  const [chatroom, setChatroom] = useState(state && state.chatroom);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProps>();
  const { chatroomId } = useParams<{ chatroomId: string }>();

  useInitializeAuth();

  useEffect(() => {
    if (!chatroom) {
      fetch(`${process.env.REACT_APP_BASE_URL}/chatroom/${chatroomId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((response) => {
          setChatroom(() => response.data);
        })
        .catch((error) => {
          console.error("failed to fetch chatroom data");
        });
    }
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
        <div className="video-buttons">
          <div className="page-chatroom-name">
            {chatroom ? chatroom.emoji + " " + chatroom.chatroomName : ""}
            {chatroom ? <span className="lock-icon"> 🔒</span> : <></>}
          </div>
          <button className="add-video-button" onClick={changeModalStatus}>
            Add More
          </button>
        </div>
      </div>

      <div className="chatroom-page">
        {isWindow && chatroomId && (
          <Playlist chatroom={chatroom} selectedVideo={selectedVideo} />
        )}
        <div className="video-player">
          {isWindow && <VideoPlayer chatroom={chatroom} />}
        </div>
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

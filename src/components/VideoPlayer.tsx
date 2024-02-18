import React, { useState, useEffect } from "react";
import PlayerScreen from "./PlayerScreen";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { VideoDTO } from "../props/VideoDTO";

const VideoPlayer = () => {
  const [videoId, setVideoId] = useState<string>("");
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [client, setClient] = useState<any>(null);

  // 채팅방 입장시 현재곡 재생
  useEffect(() => {
    const client = Stomp.over(
      () => new SockJS(`${process.env.REACT_APP_WS_URL}`)
    );
    client.debug = function () {};

    client.connect({}, () => {
      client.send(
        `/pub/video/current`,
        {},
        JSON.stringify({ chatroomId: chatroomId })
      );
      client.subscribe(
        `/sub/video/${chatroomId}`,
        (response: { body: string }) => {
          const currentVideo: VideoDTO = JSON.parse(response.body);
          if (currentVideo.url) {
            const urlParams = new URLSearchParams(
              new URL(currentVideo.url).search
            );
            setVideoId(urlParams.get("v") || "");
          } else {
            setVideoId("");
          }
        }
      );
    });

    setClient(client);
    return () => {
      client.disconnect();
    };
  }, [chatroomId, videoId]);

  const loadNextVideo = () => {
    if (client) {
      client.send(
        `/pub/video/next`,
        {},
        JSON.stringify({ chatroomId: chatroomId })
      );
    }
  };

  const handleNextVideo = () => {
    loadNextVideo();
  };

  const handleVideoEnd = () => {
    loadNextVideo();
  };

  return videoId ? (
    <>
      <PlayerScreen videoId={videoId} onVideoEnd={handleVideoEnd} />
      <button className="add-video-button" onClick={handleNextVideo}>
        Next
      </button>
    </>
  ) : (
    <div className="no-video">Add More Videos On The Playlist!</div>
  );
};

export default VideoPlayer;

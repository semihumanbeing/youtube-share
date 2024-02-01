import React, { useState, useEffect } from "react";
import PlayerScreen from "./PlayerScreen";

const VideoPlayer = () => {
  const [videoId, setVideoId] = useState<string>("");

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_BASE_URL}/video/next`, {
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       const urlParams = new URLSearchParams(
  //         new URL(response.data.url).search
  //       );
  //       setVideoId(urlParams.get("v") || "");
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching video URL:", error);
  //     });
  // }, []);

  // 플레이리스트 만들기 전 테스트용
  useEffect(() => {
    const urlParams = new URLSearchParams(
      new URL(
        "https://www.youtube.com/watch?v=UyZfCrrdbm8&t=2507s&ab_channel=TheSilentWatcher"
      ).search
    );
    setVideoId(urlParams.get("v") || "");
  }, []);

  return videoId ? (
    <PlayerScreen videoId={videoId} />
  ) : (
    <div className="no-video">Add More Videos On The Playlist!</div>
  );
};

export default VideoPlayer;

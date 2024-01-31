import React, { useState, useEffect } from "react";
import PlayerScreen from "./PlayerScreen";

const VideoPlayer = () => {
  const [videoId, setVideoId] = useState<string>("");

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/video/next", { credentials: "include" })
      .then((response) => response.json())
      .then((response) => {
        const urlParams = new URLSearchParams(
          new URL(response.data.url).search
        );
        setVideoId(urlParams.get("v") || "");
      })
      .catch((error) => {
        console.error("Error fetching video URL:", error);
      });
  }, []);

  return videoId ? (
    <PlayerScreen videoId={videoId} />
  ) : (
    <div className="no-video">Add More Videos On The Playlist!</div>
  );
};

export default VideoPlayer;

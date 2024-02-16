import React, { useContext, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface PlayerScreenProps {
  videoId: string;
  onVideoEnd: () => void;
}

const onPlayerReady: YouTubeProps["onReady"] = (event) => {
  event.target.playVideo();
};

const PlayerScreen = ({ videoId, onVideoEnd }: PlayerScreenProps) => {
  const opts = {
    height: "400",
    width: "650",
    playerVars: {
      autoplay: 1,
      controls: 1, //플레이어 컨트롤러 표시여부(0:표시안함)
      playsinline: 1, //iOS환경에서 전체화면으로 재생하지 않게
    },
  };
  const playerRef = useRef<any>(null);

  // video id가 바뀌면 새로운 비디오 재생
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onPlayerReady}
      onEnd={() => onVideoEnd()}
    />
  );
};

export default PlayerScreen;

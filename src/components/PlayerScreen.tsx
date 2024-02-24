import React, { useContext, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface PlayerScreenProps {
  playedAt: Date | undefined;
  videoId: string;
  onVideoEnd: () => void;
}

const onPlayerReady: YouTubeProps["onReady"] = (event) => {
  event.target.playVideo();
};

const onPlayerPause: YouTubeProps["onPause"] = (event) => {
  event.target.playVideo();
};

const PlayerScreen = ({ videoId, playedAt, onVideoEnd }: PlayerScreenProps) => {
  const opts = {
    height: "400",
    width: "650",
    playerVars: {
      autoplay: 1,
      controls: 0, //플레이어 컨트롤러 표시여부(0:표시안함)
      playsinline: 1, //iOS환경에서 전체화면으로 재생하지 않게
      rel: 0, //관련 동영상 표시하지 않음
      disablekb: 1,
    },
  };
  const playerRef = useRef<any>(null);
  const seekAndPlay = () => {
    if (playedAt instanceof Date && playerRef.current) {
      const currentTime = new Date().getTime() / 1000;
      const startedTime = playedAt.getTime() / 1000;
      const timeDifference = currentTime - startedTime;

      playerRef.current.internalPlayer.seekTo(timeDifference, true);
    } else {
      playerRef.current.internalPlayer.loadVideoById(videoId);
    }
  };

  useEffect(() => {
    seekAndPlay();
  }, [playedAt]);

  // video id가 바뀌면 새로운 비디오 재생
  useEffect(() => {
    seekAndPlay();
  }, [videoId]);

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onPlayerReady}
      onPause={onPlayerPause}
      onStateChange={onPlayerReady}
      onEnd={() => onVideoEnd()}
      ref={playerRef}
    />
  );
};

export default PlayerScreen;

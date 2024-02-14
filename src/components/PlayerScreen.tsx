import React from "react";
import YouTube from "react-youtube";

interface PlayerScreenProps {
  videoId: string;
}

const PlayerScreen = ({ videoId }: PlayerScreenProps) => {
  const opts = {
    height: "400",
    width: "650",
    playerVars: {
      autoplay: 1,
      controls: 0, //플레이어 컨트롤러 표시여부(0:표시안함)
      playsinline: 1, //iOS환경에서 전체화면으로 재생하지 않게
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default PlayerScreen;

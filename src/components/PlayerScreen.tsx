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
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default PlayerScreen;

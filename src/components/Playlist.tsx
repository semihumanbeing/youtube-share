import React, { useEffect, useState } from "react";
import VideoModal from "./modal/VideoModal";

interface PlaylistProps {
  playlistId: number;
  chatroomId: string;
  playlistName: string;
  isActive: boolean;
  videos: VideoProps[];
}

interface VideoProps {
  videoId: number;
  playlistId: number;
  userId: number;
  url: string;
  title: string;
  artist: string;
  isCurrent: boolean;
}

const Playlist = ({ chatroomId }: any) => {
  const [playlist, setPlaylist] = useState<PlaylistProps | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      await fetch(`${process.env.REACT_APP_BASE_URL}/playlist/${chatroomId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response.data);
          setPlaylist(response.data);
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    fetchPlaylist();
  }, [chatroomId]);

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="playlist">
      {playlist.videos.length === 0 ? (
        <p>곡을 추가하세요</p>
      ) : (
        <div className="video-list">
          {playlist.videos.map((video) => (
            <div
              key={video.videoId}
              className={`video-item ${video.isCurrent ? "current-song" : ""}`}
            >
              <p>{video.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;

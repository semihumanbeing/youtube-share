import React, { useEffect, useState } from "react";
import { VideoProps } from "../props/VideoProps";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";
interface PlaylistPageProps {
  chatroomId: string;
  selectedVideo?: VideoProps;
}
interface PlaylistProps {
  playlistId: number;
  chatroomId: string;
  playlistName: string;
  isActive: boolean;
  videos: VideoDTO[];
}

interface VideoDTO {
  videoId: number;
  playlistId: number;
  userId: number;
  username: string;
  url: string;
  title: string;
  artist: string;
  isCurrent: boolean;
  thumbnailImg: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

const Playlist = ({ chatroomId, selectedVideo }: PlaylistPageProps) => {
  const [playlist, setPlaylist] = useState<PlaylistProps | null>(null);
  const [user, setUser] = useRecoilState(userState);

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
          setPlaylist(response.data);
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    fetchPlaylist();
  }, [chatroomId]);

  useEffect(() => {
    const addVideoToPlaylist = async () => {
      if (selectedVideo && playlist) {
        await fetch(
          `${process.env.REACT_APP_BASE_URL}/video/${chatroomId}/${playlist?.playlistId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: `https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`,
              username: user.username,
              title: selectedVideo.snippet.title,
              artist: selectedVideo.snippet.channelTitle,
              thumbnailImg: selectedVideo.snippet.thumbnails.default.url,
              thumbnailWidth: selectedVideo.snippet.thumbnails.default.width,
              thumbnailHeight: selectedVideo.snippet.thumbnails.default.height,
            }),
          }
        )
          .then((response) => response.json())
          .then((response) => {
            if (response.data) {
              console.log(response);
              setPlaylist((prevPlaylist) => ({
                ...prevPlaylist!,
                videos: [...prevPlaylist!.videos, response.data],
              }));
            }
          })
          .catch((error) => console.error(error));
      }
    };

    addVideoToPlaylist();
  }, [selectedVideo]);

  if (!playlist) {
    return <div>Loading...</div>;
  }

  const onDeleteVideo = async (videoId: number) => {
    await fetch(
      `${process.env.REACT_APP_BASE_URL}/video/${chatroomId}/${playlist.playlistId}/${videoId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.data) {
          setPlaylist((prevPlaylist) => {
            if (prevPlaylist) {
              const updatedVideos = prevPlaylist.videos.filter(
                (video) => video.videoId !== videoId
              );
              return {
                ...prevPlaylist,
                videos: updatedVideos,
              };
            }
            return prevPlaylist;
          });
        } else {
          alert("failed to delete the song on playlist");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="playlist">
      {playlist.videos.length === 0 ? (
        <p>곡을 추가하세요</p>
      ) : (
        <div className="video-list">
          {playlist.videos.map((video) => (
            <div className="video-info-box" key={video.videoId}>
              {user.userId == video.userId && (
                <button
                  className="video-delete-button"
                  onClick={() => onDeleteVideo(video.videoId)}
                >
                  Delete
                </button>
              )}
              <div
                className={`video-item ${
                  video.isCurrent ? "current-song" : ""
                }`}
              >
                <img
                  src={video.thumbnailImg}
                  width={video.thumbnailWidth}
                  height={video.thumbnailHeight}
                ></img>
                <p className="title">{video.title}</p>
              </div>
              <p className="video-info">
                {video.artist} | {video.username} Added
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;

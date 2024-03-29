import React, { useEffect, useRef, useState } from "react";
import { VideoProps } from "../props/VideoProps";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";
import { PlaylistProps } from "../props/PlaylistProps";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import { ChatroomProps } from "../props/ChatroomProps";

interface PlaylistPageProps {
  selectedVideo?: VideoProps;
  chatroom: ChatroomProps;
}

const Playlist = ({ chatroom, selectedVideo }: PlaylistPageProps) => {
  const [playlist, setPlaylist] = useState<PlaylistProps | null>(null);
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [user] = useRecoilState(userState);

  // 처음 접속 시 플레이리스트 불러오기
  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.REACT_APP_BASE_URL}/playlist/sse/${chatroomId}`,
      {
        withCredentials: true,
      }
    );
    eventSource.addEventListener(
      `/playlist/${chatroomId}/${user.userId}`,
      (event: MessageEvent) => {
        setPlaylist(JSON.parse(event.data));
      }
    );
    return () => {
      eventSource.close();
    };
  }, [chatroomId]);

  // 현재 비디오 재생
  const playCurrent = () => {
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

      client.disconnect();
    });
  };

  // 플레이리스트에 새 비디오 추가
  useEffect(() => {
    const addVideoToPlaylist = async () => {
      if (selectedVideo && playlist) {
        const before = playlist.videos.length;
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
              const after = before + 1;
              if (before == 0 && after == 1) {
                playCurrent();
              }
            }
          })
          .catch((error) => console.error(error));
      }
    };

    addVideoToPlaylist();
  }, [selectedVideo]);

  if (!playlist) {
    return <h3 className="playlist-empty">Loading...</h3>;
  }

  // 플레이리스트의 비디오 삭제
  const onDeleteVideo = async (videoId: number) => {
    await fetch(
      `${process.env.REACT_APP_BASE_URL}/video/${chatroomId}/${playlist.playlistId}/${videoId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    ).catch((error) => console.error(error));
  };

  return (
    <div className="playlist">
      {playlist.videos.length === 0 ? (
        <h3 className="playlist-empty">Playlist is empty</h3>
      ) : (
        <div className="video-list">
          {playlist.videos.map((video) => (
            <div
              className={`video-info-box ${
                video.isCurrent ? "current-song" : ""
              }`}
              key={video.videoId}
            >
              {(user.userId == video.userId ||
                user.userId == chatroom.userId) && (
                <button
                  className="video-delete-button"
                  onClick={() => onDeleteVideo(video.videoId)}
                >
                  Delete
                </button>
              )}
              <div className={"video-item"}>
                <img
                  src={video.thumbnailImg}
                  width={video.thumbnailWidth * 0.8}
                  height={video.thumbnailHeight * 0.8}
                ></img>
                <p className="title">{video.title}</p>
              </div>

              <p className="video-info">
                {video.isCurrent ? "Current Song | " : ""}
                By {video.artist} | {video.username} Added
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;

import React, { useState } from "react";
import { VideoProps } from "../../props/VideoProps";
import { useLocation, useNavigate } from "react-router-dom";
interface VideoModalProps {
  onCloseModal: () => void;
  onSelectVideo: (video: VideoProps) => void;
}

const VideoModal = ({ onCloseModal, onSelectVideo }: VideoModalProps) => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [searchParam, setSearchParam] = useState("");
  const { state } = useLocation();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchParam}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

  const handleSubmit = async () => {
    await fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.items);
        setVideos(
          response.items.map((video: VideoProps) => ({
            id: video.id,
            snippet: {
              ...video.snippet,
              title: video.snippet.title.replace("&#39;", "'"),
            },
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function handleVideoClick(video: VideoProps) {
    if (confirm("Add this video to the playlist")) {
      onSelectVideo(video);
      setNotificationMessage("Added to Playlist!");
      setIsNotificationVisible(true);

      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 2000);
    } else {
      return;
    }
  }

  return (
    <div className="search-modal">
      <div className="search-controls">
        <input
          className="search-input"
          type="text"
          placeholder="search youtube videos"
          onChange={(e) => setSearchParam(e.target.value)}
        />
        <button className="search-button" onClick={handleSubmit}>
          Search
        </button>
        <button className="search-button" onClick={onCloseModal}>
          Close
        </button>
      </div>

      <div className="search-videos-container">
        {videos.map((video) => (
          <div
            className="search-videos"
            key={video.id.videoId}
            onClick={(e) => {
              e.preventDefault();
              handleVideoClick(video);
            }}
          >
            <img
              src={video.snippet.thumbnails.default.url}
              height={video.snippet.thumbnails.default.height}
              width={video.snippet.thumbnails.default.width}
            ></img>
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>

      <div
        className={`notification-modal ${
          isNotificationVisible ? "visible" : ""
        }`}
      >
        {notificationMessage}
      </div>
    </div>
  );
};

export default VideoModal;

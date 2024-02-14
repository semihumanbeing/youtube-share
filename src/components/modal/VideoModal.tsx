import React, { useCallback, useEffect, useState } from "react";
interface VideoModalProps {
  onCloseModal: () => void;
}
interface VideoProps {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
  };
  // 다른 필요한 속성들도 추가할 수 있습니다.
}

const VideoModal = ({ onCloseModal }: VideoModalProps) => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [searchParam, setSearchParam] = useState("");

  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${searchParam}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

  const handleSubmit = async () => {
    await fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.items);
        setVideos(response.items);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
          <div className="search-videos" key={video.id.videoId}>
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoModal;

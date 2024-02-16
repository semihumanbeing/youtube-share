import { VideoDTO } from "./VideoDTO";

export interface PlaylistProps {
  playlistId: number;
  chatroomId: string;
  playlistName: string;
  isActive: boolean;
  videos: VideoDTO[];
}

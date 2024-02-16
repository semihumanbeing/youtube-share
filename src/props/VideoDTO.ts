export interface VideoDTO {
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

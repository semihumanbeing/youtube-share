export interface VideoDTO {
  videoId: number;
  playlistId: number;
  userId: number;
  username: string;
  url: string;
  title: string;
  artist: string;
  isCurrent: boolean;
  playedAt: Date;
  thumbnailImg: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

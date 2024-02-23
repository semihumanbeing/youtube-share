export interface ChatroomProps {
  chatroomId: string;
  userId: number;
  username: string;
  chatroomName: string;
  emoji: string;
  chatroomPassword: string;
  userCount: number;
  maxUserCount: number;
  hasPwd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummaryDTO {
  id: number;
  username: string;
  photoUrl?: string;
}

export interface FollowResponseDTO {
  id: number;
  user: UserSummaryDTO;
  createdAt: string;
}

export interface FollowCountDTO {
  followers: number;
  following: number;
}
export interface ILeaderScore {
  avatar: string;
  name: string;
  time: number;
}

export interface ILeaderboardResponse {
  data: ILeaderScore;
}

export interface ILeaderboardRequest {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}

export interface IAddLeaderboardResultRequest {
  data: ILeaderScore;
  ratingFieldName: string;
  teamName: string;
}

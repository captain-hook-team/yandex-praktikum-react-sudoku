import apiConfig from '../config/ApiConfig';
import { fetchWithCookies } from './BaseApi';
import { IAddLeaderboardResultRequest, ILeaderboardRequest, ILeaderboardResponse } from '../models/LeaderBoard';

export const addLeaderboardResult = async (data: IAddLeaderboardResultRequest) => {
  return fetchWithCookies(`${apiConfig.baseUrl}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const getLeaderboard = async (data: ILeaderboardRequest): Promise<ILeaderboardResponse[]> => {
  return fetchWithCookies(`${apiConfig.baseUrl}/leaderboard/CaptainHook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

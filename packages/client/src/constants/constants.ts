/* eslint-disable no-undef */
import '../client.d';

enum ROUTES {
  MAIN = '/',
  SIGN_UP = '/signup',
  GAME = '/sudoku',
  LEADERBOARD = '/leaderboard',
  LOGIN = '/login',
  PROFILE = '/profile',
  TOPIC = '/forum/topic/:id',
  CREATE_TOPIC = '/forum/create',
  TOPICS = '/forum',
  TOPICS_LIST = '/forum/:id',
  INTERNAL_SERVER_ERROR = '/500',
  UNDEFINED = '*',
  NOT_FOUND_404 = '/404',
}

export default ROUTES;

export const GAME_BUTTONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export enum EMOJI {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export const isServer = typeof window === 'undefined';
// Добавлена новая константа для URL сервера
export const SERVER_HOST = isServer
  ? __INTERNAL_SERVER_URL__
  : __EXTERNAL_SERVER_URL__;

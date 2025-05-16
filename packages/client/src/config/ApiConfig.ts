import { isServer, SERVER_HOST } from '../constants/constants';

export const BASE_URL = 'https://ya-praktikum.tech/api/v2';
export const BASE_URL_RESOURCE = 'https://ya-praktikum.tech/api/v2/resources';

// Константа для API, которая будет использовать SERVER_HOST для SSR
export const API_URL = isServer
  ? `${SERVER_HOST}/api/v2` // для серверных запросов
  : BASE_URL; // для клиентских запросов

export const API_RESOURCE_URL = isServer
  ? `${SERVER_HOST}/api/v2/resources`
  : BASE_URL_RESOURCE;

const apiConfig = {
  baseUrl: API_URL,
  baseUrlResource: API_RESOURCE_URL,
};

export default apiConfig;

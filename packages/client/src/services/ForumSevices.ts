import apiConfig from '../config/ApiConfig';
import { fetchWithCookies } from './BaseApi';
import {
  IFolderTopic,
  ITopic,
  ITopicList,
  IComment,
  TopicListItem,
  TopicDetails,
  CreateTopicResponse,
  SendMessageResponse,
} from '../models/Forum';

function isTopicListItemArray(data: TopicListItem[]): data is TopicListItem[] {
  return Array.isArray(data) && data.every((item) => typeof item.topic_id === 'number');
}
export const getFolders = async (): Promise<IFolderTopic[]> => {
  const response: Response = await fetchWithCookies(`${apiConfig.baseUrl}/folders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки разделов');
  }

  const data: TopicListItem[] = await response.json();

  if (!isTopicListItemArray(data)) {
    throw new Error('Некорректные данные от /folders');
  }

  return data.map((folder) => ({
    id: folder.topic_id,
    title: folder.topic_name,
    content: folder.topic_descr,
    topicsCount: folder.topics_count || 0,
    lastPostPreview: folder.last_post_preview || '',
    repliesCount: folder.messages_count || 0,
    createUrl: `/topic/create?folderId=${folder.topic_id}`,
  }));
};

export const getTopicsByFolderId = async (folderId: number): Promise<ITopicList[]> => {
  const response: Response = await fetchWithCookies(`${apiConfig.baseUrl}/topics?folder_id=${folderId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки тем');
  }

  const data: TopicListItem[] = await response.json();

  if (!isTopicListItemArray(data)) {
    throw new Error('Некорректные данные от /topics');
  }

  return data.map((topic) => ({
    id: topic.topic_id,
    parentId: folderId,
    title: topic.topic_name,
    content: topic.topic_descr,
    lastPostPreview: topic.last_post_preview || '',
    repliesCount: topic.messages_count || 0,
    children: [],
  }));
};

/**
 * Создать новый топик в разделе
 * @param folderId ID раздела
 * @param title Название топика
 * @param content Описание топика
 */
export const createTopic = async (
  folderId: number,
  title: string,
  content: string
): Promise<{ message: string; data: ITopic }> => {
  const response: Response = await fetchWithCookies(`${apiConfig.baseUrl}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      folder_id: folderId,
      topic_name: title,
      topic_descr: content,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать топик');
  }

  const result: CreateTopicResponse = await response.json();

  return {
    message: result.message || 'Топик создан',
    data: {
      id: result.data.topic_id,
      parentId: folderId,
      title: result.data.topic_name,
      content: result.data.topic_descr,
    },
  };
};

export const getTopicById = async (topicId: number): Promise<ITopic> => {
  const response: Response = await fetchWithCookies(`${apiConfig.baseUrl}/topic/${topicId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить тему');
  }

  const data: TopicDetails = await response.json();

  return {
    id: data.topic_id,
    title: data.topic_name,
    content: data.topic_descr,
    parentId: data.folder_id || undefined,
    author: data.user_name ? {
      name: data.user_name,
      avatarUrl: data.avatar_url || '/default-avatar.png',
    } : undefined,
    comments: data.messages?.map((msg) => ({
      id: msg.message_id,
      author: {
        name: msg.user_name,
        avatarUrl: msg.avatar_url || '/default-avatar.png',
      },
      content: msg.message_text,
    })),
  };
};

/**
 * Отправить сообщение в топик
 * @param topicId ID топика
 * @param userName Имя пользователя
 * @param messageText Текст сообщения
 */
export const sendMessage = async (
  topicId: number,
  userName: string,
  messageText: string
): Promise<{ message: string; data: IComment }> => {
  const response: Response = await fetchWithCookies(`${apiConfig.baseUrl}/topic/${topicId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: userName,
      message_text: messageText,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить сообщение');
  }

  const result: SendMessageResponse = await response.json();

  return {
    message: result.message || 'Сообщение отправлено',
    data: {
      id: result.data.message_id,
      author: {
        name: userName,
        avatarUrl: '/default-avatar.png', // Можно заменить на URL из бэкенда
      },
      content: messageText,
    },
  };
};

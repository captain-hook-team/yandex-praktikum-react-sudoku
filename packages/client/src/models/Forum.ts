export interface IComment {
  id: number;
  author: { name: string; avatarUrl: string };
  content: string;
}
export interface ITopic {
  id: number;
  parentId?: number;
  title: string;
  content?: string;
  author?: { name: string; avatarUrl: string };
  comments?: IComment[];
}

export interface IFolderTopic extends ITopic {
  topicsCount: number;
  lastPostPreview: string;
  createUrl: string;
  repliesCount: number;
}

export interface ITopicList extends ITopic {
  lastPostPreview: string;
  repliesCount?: number;
  children: ITopic[];
}

export type TopicListItem = {
  topic_id: number;
  topic_name: string;
  topic_descr?: string;
  messages_count?: number;
  last_post_preview?: string;
  topics_count?: number;
};

export type TopicDetails = {
  topic_id: number;
  topic_name: string;
  topic_descr?: string;
  folder_id?: number;
  messages_count: number;
  user_name: string;
  avatar_url?: string;
  messages: Array<{
    message_id: number;
    user_name: string;
    avatar_url?: string;
    message_text: string;
  }>;
};

export type CreateTopicResponse = {
  message: string;
  data: {
    topic_id: number;
    topic_name: string;
    topic_descr: string;
  };
};

export type SendMessageResponse = {
  message: string;
  data: {
    message_id: number;
    topic_id: number;
    user_name: string;
    message_text: string;
  };
};

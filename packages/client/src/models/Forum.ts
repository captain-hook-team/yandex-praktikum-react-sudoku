export interface IComment {
  id: number;
  author: { name: string; avatarUrl: string };
  content: string;
  reaction?: string;
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

import { useParams } from 'react-router-dom';
import styles from './ForumPage.module.scss';
import { IFolderTopic, ITopicList } from '../../models/Forum';
import BackButton from '../../components/back-button/BackButton';
import TopicListPage from '../topic-list-page/TopicListPage';
import TopicFolderListPage from '../topic-folder-list-page/TopicFolderListPage';

interface ForumPageProps {
  folders: IFolderTopic[];
  topics: ITopicList[];
}

export default function ForumPage({ folders, topics }: ForumPageProps) {
  const { id } = useParams<{ id: string }>();
  const currentId = id ? Number(id) : null;
  const headerRowClass = id
    ? styles.page__headerList
    : styles.page__headerFolder;
  const filteredTopics = currentId
    ? topics.filter((topic) => topic.parentId === currentId)
    : [];
  return (
    <div className={styles.page}>
      <BackButton />
      <div className={`${styles.page__header} ${headerRowClass}`}>
        {!id && <span className={styles.page__headerTitle}>Форумы</span>}
        <span
          className={
            id ? `${styles.page__headerSpan} ${styles.page__headerTitle}` : ''
          }
        >
          Темы
        </span>
        <span className={styles.page__headerSpan}>Ответы</span>
        <span className={styles.page__headerSpan}>Последняя тема</span>
      </div>
      <div className={styles.page__topicList}>
        {currentId ? (
          <TopicListPage topics={filteredTopics} />
        ) : (
          <TopicFolderListPage folders={folders} />
        )}
      </div>
    </div>
  );
}

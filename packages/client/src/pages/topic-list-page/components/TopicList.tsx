import { Link } from 'react-router-dom';
import styles from '../TopicListPage.module.scss';
import { ITopicList } from '../../../models/Forum';

export default function TopicList({ topic }: { topic: ITopicList }) {
  if (!topic) {
    return (
      <div className={styles.overlay}>
        <p className={styles.overlay__text}>Загрузка...</p>
      </div>
    );
  }

  return (
    <li className={styles.card}>
      <div className={styles.info}>
        <Link className={styles.link} to={`/forum/topic/${topic.id}`}>
          <h3 className={styles.title}>{topic.title}</h3>
        </Link>

        <span className={styles.replies}>{topic.repliesCount}</span>
        <p className={styles.preview}>{topic.lastPostPreview}</p>
      </div>
    </li>
  );
}

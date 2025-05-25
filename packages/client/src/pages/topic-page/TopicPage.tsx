import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TopicPage.module.scss';
import { ITopic } from '../../models/Forum';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import BackButton from '../../components/back-button/BackButton';
import { getTopicById, sendMessage } from '../../services/ForumSevices';

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<ITopic | null>(null);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        const data = await getTopicById(Number(id));
        setTopic(data);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    };

    loadTopic();
  }, [id]);

  const handleSubmit = useCallback(async (value: string) => {
    if (!topic || !value.trim()) return;

    try {
      const newComment = await sendMessage(Number(id), 'User', value); // можно заменить 'User' на имя пользователя из контекста
      setTopic((prev) =>
        (prev
          ? {
            ...prev,
            comments: [...(prev.comments || []), newComment.data],
          }
          : null)
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }, [topic, id]);

  if (!topic) {
    return (
      <div className={styles.overlay}>
        <p className={styles.overlay__text}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.page__container}>
        <div className={styles.page__authorInfo}>
          <img
            src={topic.author?.avatarUrl}
            alt={topic.author?.name}
            className={styles.page__authorAvatar}
          />
        </div>

        <div>
          <h2>{topic.title}</h2>
          <p>{topic.content}</p>
        </div>

        <CommentList
          comments={topic.comments}
          commentsListClass={styles.comments}
          commentClass={styles.comments__comment}
        />
        <CommentForm
          onSubmit={handleSubmit}
          inputClass={styles.comments__commentInput}
          formButtonClass={styles.comments__sendButton}
          formClass={styles.comments__commentForm}
        />
      </div>
    </div>
  );
}

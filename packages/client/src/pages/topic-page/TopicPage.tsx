/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TopicPage.module.scss';
import { mockTopic } from '../../constants/mocks';
import { ITopic } from '../../models/Forum';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import BackButton from '../../components/back-button/BackButton';
import { PageInitArgs } from '../../routes-object';
import { selectUser } from '../../store/slices/userSlice';
import { fetchUserData } from '../../store/slices/userExtraReducers';
import { AppHeader } from '../../components';
import usePage from '../../hooks/usePage';

export const initTopicPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

export default function TopicPage() {
  usePage({ initPage: initTopicPage });

  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<ITopic | null>(null);

  useEffect(() => {
    const foundTopic = mockTopic.find(
      (topicInfo: ITopic) => topicInfo.id === Number(id)
    );
    if (foundTopic) {
      setTopic(foundTopic);
    }
  }, [id]);

  const handleSubmit = useCallback((value: string) => {
    console.log(`Submit comment: ${value}`);
  }, []);

  if (!topic) {
    return (
      <div className={styles.overlay}>
        <p className={styles.overlay__text}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>
          {topic.title}
          {' '}
        </title>
        <meta name="description" content="Страница темы форума" />
      </HelmetComponent>
      <AppHeader />
      <section className={styles.page}>
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
      </section>
    </>
  );
}

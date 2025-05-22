import { Helmet } from 'react-helmet';
import React, { FormEvent, useState } from 'react';
import styles from './TopicCreatePage.module.scss';
import BackButton from '../../components/back-button/BackButton';
import CustomButton from '../../components/custom-button/CustomButton';
import { selectUser } from '../../store/slices/userSlice';
import { fetchUserData } from '../../store/slices/userExtraReducers';
import { PageInitArgs } from '../../routes-object';
import { AppHeader } from '../../components';
import usePage from '../../hooks/usePage';

export const initTopicCreatePage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

export default function TopicCreatePage() {
  usePage({ initPage: initTopicCreatePage });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log('Created topic:', { title, content });
    setTitle('');
    setContent('');
  };
  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>Создать новую тему</title>
        <meta name="description" content="Страница создания новой темы форума" />
      </HelmetComponent>
      <AppHeader />
      <section className={styles.page}>
        <h1>Создать новую тему</h1>
        <BackButton />
        <form className={styles.page__createTopicForm} onSubmit={handleSubmit}>
          <div className={styles.page__formGroup}>
            <label htmlFor="title">Заголовок</label>
            <input
              className={styles.page__input}
              id="title"
              type="text"
              placeholder="Введите заголовок топика"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className={styles.page__formGroup}>
            <label className={styles.page__label} htmlFor="content">
              Содержимое
            </label>
            <textarea
              className={styles.page__input}
              id="content"
              placeholder="Введите содержимое топика"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
          <div className={styles.page__saveButton}>
            <CustomButton
              type="submit"
              color="primary"
              text="Создать"
              onClick={handleSubmit}
            />
          </div>
        </form>
      </section>
    </>
  );
}

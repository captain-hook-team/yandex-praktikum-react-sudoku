/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { mockFoldersTopics, mockTopics } from '../../constants/mocks';
import { IFolderTopic, ITopicList } from '../../models/Forum';
import ForumPage from '../../pages/forum-page/ForumPage';
import { selectUser } from '../../store/slices/userSlice';
import { fetchUserData } from '../../store/slices/userExtraReducers';
import { PageInitArgs } from '../../routes-object';
import AppHeader from '../app-header/AppHeader';
import usePage from '../../hooks/usePage';

export const initForumPageWrapper = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

export default function ForumPageWrapper() {
  usePage({ initPage: initForumPageWrapper });

  const [folders, setFolders] = useState<IFolderTopic[]>([]);
  const [topics, setTopics] = useState<ITopicList[]>([]);

  useEffect(() => {
    // Загрузка моковых данных
    setFolders(mockFoldersTopics);
    setTopics(mockTopics);
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <AppHeader />
      <ForumPage folders={folders} topics={topics} />
    </>
  );
}

import { useEffect, useState } from 'react';

import { IFolderTopic, ITopicList } from '../../models/Forum';
import ForumPage from '../../pages/forum-page/ForumPage';
import { getFolders, getTopicsByFolderId } from '../../services/ForumSevices';

export default function ForumPageWrapper() {
  const [folders, setFolders] = useState<IFolderTopic[]>([]);
  const [topics, setTopics] = useState<ITopicList[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const foldersData = await getFolders();
      const topicsData = await getTopicsByFolderId(
        foldersData[0]?.id || 1
      ); // загрузим темы первого раздела как пример

      setFolders(foldersData);
      setTopics(topicsData);
    };

    loadData();
  }, []);

  return <ForumPage folders={folders} topics={topics} />;
}

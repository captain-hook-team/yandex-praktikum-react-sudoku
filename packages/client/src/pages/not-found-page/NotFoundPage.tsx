/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import usePage from '../../hooks/usePage';
import { AppHeader, ErrorComponent } from '../../components';

export const initNotFoundPage = () => Promise.resolve();

function NotFoundPage() {
  usePage({ initPage: initNotFoundPage });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>
      <AppHeader />
      <ErrorComponent code="404" subtitle="Не туда попали" />
    </>
  );
}

export default NotFoundPage;

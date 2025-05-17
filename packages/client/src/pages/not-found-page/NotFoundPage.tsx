/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Helmet } from 'react-helmet';
import usePage from '../../hooks/usePage';
import { AppHeader, ErrorComponent } from '../../components';

export const initNotFoundPage = () => Promise.resolve();

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

function NotFoundPage() {
  usePage({ initPage: initNotFoundPage });

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </HelmetComponent>
      <AppHeader />
      <ErrorComponent code="404" subtitle="Не туда попали" />
    </>
  );
}

export default NotFoundPage;

import React from 'react';
import { Helmet } from 'react-helmet';
import usePage from '../../hooks/usePage';
import { AppHeader, ErrorComponent } from '../../components';

export const initInternalServerErrorPage = () => Promise.resolve();

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

export default function InternalServerErrorPage() {
  usePage({ initPage: initInternalServerErrorPage });

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>500</title>
        <meta name="description" content="Страница с ошибкой сервера" />
      </HelmetComponent>
      <AppHeader />
      <ErrorComponent code="500" subtitle="Мы уже фиксим" />
    </>
  );
}

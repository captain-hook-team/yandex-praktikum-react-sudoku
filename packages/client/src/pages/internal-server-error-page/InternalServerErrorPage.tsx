/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import usePage from '../../hooks/usePage';
import { AppHeader, ErrorComponent } from '../../components';

export const initInternalServerErrorPage = () => Promise.resolve();

export default function InternalServerErrorPage() {
  usePage({ initPage: initInternalServerErrorPage });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>500</title>
        <meta name="description" content="Страница с ошибкой сервера" />
      </Helmet>
      <AppHeader />
      <ErrorComponent code="500" subtitle="Мы уже фиксим" />
    </>
  );
}

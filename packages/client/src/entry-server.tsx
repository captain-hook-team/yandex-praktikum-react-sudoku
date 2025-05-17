/* eslint-disable import/no-extraneous-dependencies */
import ReactDOM from 'react-dom/server';
import { createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { Helmet, HelmetData } from 'react-helmet';
import { configureStore } from '@reduxjs/toolkit';
import { matchRoutes } from 'react-router-dom';
import { Request as ExpressRequest } from 'express';
import { rootReducer } from './store';
import routesObject from './routes-object';
import ErrorBoundary from './components/utils';
import './styles/index.scss';
import { createFetchRequest, createUrl, createContext } from './entry-server.utils';
import { setPageHasBeenInitializedOnServer } from './store/slices/ssrSlice';
import { isServer } from './constants/constants';

interface RenderResult {
  html: string;
  initialState: unknown;
  helmet: HelmetData;
}

const render = async (req: ExpressRequest): Promise<RenderResult> => {
  const preloadedState = !isServer ? window.APP_INITIAL_STATE : undefined;
  // Создаем новое хранилище для каждого запроса
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  // Создаёт вспомогательные данные
  const { query, dataRoutes } = createStaticHandler(routesObject);
  // Создаёт node Request из ExpressRequest
  const fetchRequest = createFetchRequest(req);
  // Создаёт контекст для роутера,
  // в нем будет находиться информация, которая доступна на клиенте «из коробки».
  const context = await query(fetchRequest);
  // Если context — это Response,
  // то приходит к выводу, что сейчас идёт процесс редиректа и поэтому выбрасывает исключение
  if (context instanceof Response) {
    throw context;
  }

  // Получает url от класса URL из ExpressRequest
  const url = createUrl(req);
  // Находит роут, соответствующий текущему URL адресу пользователя.
  const foundRoutes = matchRoutes(routesObject, url);

  if (!foundRoutes) {
    console.log('Роут не найден, но отдаем SPA-оболочку');
    return {
      html: '<div id="root"></div>', // Пустой root для клиента
      initialState: {},
      helmet: Helmet.renderStatic() as unknown as HelmetData, // Дефолтные метатеги
    };
  }
  // Из массива foundRoutes извлекается первый элемент, который и будет текущей страницей
  const [{ route: { fetchData } }] = foundRoutes;

  store.dispatch(setPageHasBeenInitializedOnServer(true));

  // Инициализация Helmet до рендеринга (метатеги)
  const helmet = Helmet.renderStatic() as unknown as HelmetData;

  try {
    console.log('Инициализация страницы...');
    await fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
      ctx: createContext(req),
    });
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e);
    // Fallback-метатеги, если fetchData упал
    helmet.meta.toString = () => `
      <meta name="description" content="Судоку" />
    `;
    helmet.title.toString = () => '<title>Sudoku</title>';
  }
  // Создёт статический роутер, чтобы на сервере можно было отрендерить HTML-разметку
  const router = createStaticRouter(dataRoutes, context);

  // Рендерит разметку
  const appHtml = ReactDOM.renderToString(
    <Provider store={store}>
      <ErrorBoundary>
        <StaticRouterProvider router={router} context={context} />
      </ErrorBoundary>
    </Provider>
  );

  return {
    html: appHtml,
    initialState: store.getState(),
    helmet,
  };
};

export default { render };

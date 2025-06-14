import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './styles/index.scss';
import ErrorBoundary from './components/utils';
import { store } from './store';
import routesObject from './routes-object';
import { fetchUserByCode, fetchUserData } from './store/slices/userExtraReducers';
import { isServer } from './constants/constants';
import { setTheme } from './store/slices/themeSlice';

const router = createBrowserRouter(routesObject);

// Проверка авторизации на клиенте
if (!isServer) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    console.log('code', code);
    store.dispatch(fetchUserByCode({ code }))
      .then(() => store.dispatch(fetchUserData()));
  } else {
    store.dispatch(fetchUserData());
  }
}

if ('Notification' in window) {
  window.addEventListener('load', async () => {
    await Notification.requestPermission();
  });
}

function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        })
        .catch((error: string) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

const serverTheme = window.APP_INITIAL_STATE?.theme?.currentTheme;
if (serverTheme) {
  store.dispatch(setTheme(serverTheme));
}

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </Provider>
);

startServiceWorker();

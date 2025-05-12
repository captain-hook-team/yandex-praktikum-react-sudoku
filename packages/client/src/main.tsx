import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import './styles/index.scss';
import ErrorBoundary from './components/utils';
import { store } from './store';

function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        })
        .catch((error: string) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

startServiceWorker();

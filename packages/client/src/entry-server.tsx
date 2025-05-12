import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import App from './app/App';
import { store } from './store';
import ErrorBoundary from './components/utils';

const render = (url: string): string => ReactDOM.renderToString(
  <Provider store={store}>
    <StaticRouter location={url}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StaticRouter>
  </Provider>
);

export default render;

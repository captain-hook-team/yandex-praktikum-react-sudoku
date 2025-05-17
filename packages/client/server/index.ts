/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import express, { Request as ExpressRequest } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

process.env.VITE_API_PROXY = 'true';

// Получаем __dirname и __filename вручную
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '../../.env' });

const port = process.env.SERVER_PORT || 80;
const clientPath = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';

async function createServer() {
  const app = express();

  app.use(cookieParser());

  let vite: ViteDevServer | undefined;

  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    );
  }

  // Обработка всех маршрутов для SPA
  app.get('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      // eslint-disable-next-line no-shadow
      let render: (req: ExpressRequest) => Promise<{
        html: string;
        initialState?: null;
        helmet: HelmetData;
      }>;
      let template: string;

      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        );

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template);

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).default.render;
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        );

        // Получаем путь до сбилдженого модуля клиента,
        // чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        );

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render;
      }
      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
      } = await render(req);

      // Проверка для избежания XSS
      const serializedState = serialize(initialState, {
        isJSON: true,
      });

      const helmetTags = [
        helmet?.title?.toString(),
        helmet?.meta?.toString(),
        helmet?.link?.toString(),
        helmet?.script?.toString(),
        helmet?.style?.toString(),
      ].filter(Boolean).join('\n');

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template
        .replace(
          '<!--ssr-helmet-->',
          `${helmet.meta.toString() || ''}
          ${helmet.title.toString() || ''}
          ${helmet.link.toString() || ''}`
        )
        .replace('<!--ssr-outlet-->', appHtml)
        .replace(
          '<!--ssr-initial-state-->',
          `<script>window.APP_INITIAL_STATE = ${serializedState}</script>`
        );

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  // Проксирование API запросов
  app.use('/api/v2', createProxyMiddleware({
    target: 'https://ya-praktikum.tech',
    changeOrigin: true,
    pathRewrite: { '^/api/v2': '' }, // убираем /api/v2 из пути
    onProxyReq: (proxyReq, req) => {
      // Явно указываем Accept header для JSON
      proxyReq.setHeader('Accept', 'application/json');
    },
    onProxyRes: (proxyRes) => {
      // Проверяем, что ответ - JSON
      if (!proxyRes.headers['content-type']?.includes('application/json')) {
        console.error('Invalid content type from API:', proxyRes.headers['content-type']);
      }
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }as any));

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer();

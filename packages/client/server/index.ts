import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';
import { createServer as createViteServer, ViteDevServer } from 'vite';

// Получаем __dirname и __filename вручную
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT || 80;
const clientPath = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';

async function createServer() {
  const app = express();
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
  app.get('/', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (renderUrl: string) => Promise<string>;
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
        const serverModule = await vite.ssrLoadModule(path.join(clientPath, 'src/entry-server.tsx'));
        render = serverModule.default;
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

        // Преобразуем путь в корректный URL с протоколом file://
        const moduleUrl = new URL(pathToFileURL(pathToServer)).href;

        // Импортируем этот модуль и вызываем с инишл стейтом
        const serverModule = await import(moduleUrl);
        render = serverModule.default;
      }

      // Получаем HTML-строку из JSX
      const appHtml = await render(url);

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template.replace('<!--ssr-outlet-->', appHtml);

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).send(html);
    } catch (e) {
      if (vite) {
        vite.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer();

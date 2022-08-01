
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import { PORT } from '../config';
import DBManager from '../db';
import useRoutes from './routes';

const app = fastify({ logger: true });

DBManager.init().then(() => {
  app.log.info('Connected to the database.');
  app.server.emit('ready');
}).catch((error) => {
  app.log.error(error);
});

app.server.on('ready', () => {
  void app.register(fastifyMultipart);
  void app.register(useRoutes);

  app.listen({ port: PORT }, (error) => {
    if (error) {
      app.log.error(error);
      process.exit(1);
    }
  });
});

process.on('beforeExit', () => {
  DBManager.close().catch((error) => {
    app.log.error(error);
  });
});

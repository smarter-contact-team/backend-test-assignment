import type { FastifyInstance } from 'fastify';
import { ContactController } from './controllers/ContactController';

export default function useRoutes(app: FastifyInstance, options: unknown, done: (err?: Error) => void) {
  app.post('/contacts/upload', ContactController.upload);
  
  done();
}

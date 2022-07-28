import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import 'dotenv/config';
import fastifyMikroORM  from 'fastify-mikro-orm';
import AllRoutes from './router';

const server = fastify({ logger: true });

void server.register(fastifyMultipart, {
  limits: {
    fieldNameSize: 1000, // Max field name size in bytes
    fieldSize: 1000,     // Max field value size in bytes
    fields: 100,         // Max number of non-file fields
    fileSize: 1000000,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
  },
});

void server.register(fastifyMikroORM, {
  entitiesTs: ['./src/entities/*.ts'],
  entities: ['./lib/entities/*.js'],
  dbName: 'test.db',
  type: 'sqlite',
});

void server.register(AllRoutes);

server.listen({ port: 8080 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
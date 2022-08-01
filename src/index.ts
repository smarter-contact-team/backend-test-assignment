
import fastify from "fastify";
import fastifyMikroORM from 'fastify-mikro-orm';
import fastifyMultipart from '@fastify/multipart';
import { FastifyInstance } from "fastify/types/instance";
import { Server, IncomingMessage, ServerResponse } from "http";

import router from "./routers/router";
import { StorageConfig } from "./storage/StorageConfig";

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

const db = StorageConfig.fromEnv();

void server.register(fastifyMultipart);
void server.register(fastifyMikroORM, db);

// di register

server.register(router);

const start = async () => {
  try {
    await server.listen({ port: 8080, host: "localhost" });
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
  process.exit(1); // safer
});
process.on("unhandledRejection", error => {
  console.error(error);
  process.exit(1); // safer
});

start();

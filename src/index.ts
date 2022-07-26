
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import axios from 'axios';
import 'dotenv/config';
import fastifyMikroORM  from 'fastify-mikro-orm';

import { Contacts } from './entities/Contacts';


const server = fastify({ logger: true });

void server.register(fastifyMultipart);

void server.register(fastifyMikroORM, {
  entitiesTs: ['./src/entities/*.ts'],
  entities: ['./lib/entities/*.js'],
  dbName: 'test.db',
  type: 'sqlite',
});


interface VeriResponse {
  phone_valid: boolean;
}

function validate(phone: string) {
  return axios.get<VeriResponse>(process.env.VERIPHONE_URL ?? '', {
    params: {
      key: process.env.VERIPHONE_API_KEY,
      phone: phone,
    },
  });
}

server.post('/upload', async (request, reply) => {
  const data = await request.file();
  const buffer = await data.toBuffer();
  const fileString = buffer.toString('utf8');

  const rows = fileString.split('\n');
  const headers = rows.at(0)?.replace('\r', '').split(',') ?? [];

  const contacts = rows.slice(1).map((row) => row
    .replace('\r', '')
    .split(',')
    .reduce((prev, value, i) => ({
      ...prev,
      [headers.at(i) ?? '']: value,
    }), {} as Record<string, string>));

  for await (const contact of contacts) {
    const dbCont = new Contacts();

    dbCont.name = contact.Name;
    dbCont.phone = contact.Phone;
    dbCont.email = contact.Email;
    dbCont.isValid = false;

    try {
      const res = await validate(contact.Phone);

      if (res.data.phone_valid) {
  
        dbCont.isValid = true;
      }
    } catch {
      request.log.error('invalid phone:', contact.Phone);
    }

    await request.mikroORM.orm.em.persistAndFlush(dbCont);
  }

  const validContacts = await request.mikroORM.orm.em.find(Contacts, { isValid: true });

  void reply.code(200).send({
    headers,
    validContacts: validContacts.map(contact => contact.toJSON()),
  });
});

// Start your server
server.listen({ port: 8080 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
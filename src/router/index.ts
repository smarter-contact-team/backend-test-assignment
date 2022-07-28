import {
  FastifyInstance,
  FastifyPluginAsync,
} from 'fastify';
import fp from 'fastify-plugin';
import { Contacts } from '../entities/Contacts';
import { csvToJSON } from '../helpers';
import { MultipartFile } from '@fastify/multipart';
import validatePhone from '../services/validate-phone';

const AllRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get<{ Body: JSON }>('/', async (request, reply) => {
    try {
      const users = await request.mikroORM.orm.em.find(Contacts, {});
      void reply.code(200).send(users.map(contact => contact.toJSON()));
    } catch (error) {
      request.log.error(error);
      void reply.send(500);
    }
  });

  server.post<{ Body: MultipartFile }>('/upload', async (request, reply) => {
    const data = await request.file();
    const [headers, contacts] = await csvToJSON(data);

    if (!contacts.length) {
      throw new Error('Not found contacts in file');
    }

    const saveContacts = [];

    for await (const contact of contacts) {
      const dbCont = new Contacts();

      Object.assign(dbCont, contact, {
        isValid: false,
      });

      try {
        const res = await validatePhone(dbCont.phone);

        if (res.data.phone_valid) {
          dbCont.isValid = true;
        }
      } catch {
        request.log.error('invalid phone:', dbCont.phone);
      }

      saveContacts.push(dbCont);
    }

    await request.mikroORM.orm.em.persistAndFlush(saveContacts);

    const validContacts = await request.mikroORM.orm.em.find(Contacts, { isValid: true });

    void reply.code(200).send({
      headers,
      validContacts: validContacts.map(contact => contact.toJSON()),
    });
  });
};
export default fp(AllRoutes);
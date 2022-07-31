import type { FastifyRequest, FastifyReply } from 'fastify';
import ContactMapper from '../../mappers/ContactMapper';
import ContactService from '../../services/ContactService';

export class ContactController {
  static upload = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();
    const buffer = await data.toBuffer();

    const rawContacts = ContactMapper.csvBufferToJSON(buffer);
    const validContacts = await ContactService.upload(rawContacts);
    
    void reply.code(200).send(validContacts);
  };
}
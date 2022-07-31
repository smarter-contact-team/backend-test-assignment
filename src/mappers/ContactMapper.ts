import { Contact } from '../db/entities/Contact';
import { ContactDTO } from '../dtos/ContactDTO';
import type { EntityDTO } from '@mikro-orm/core';

export default class ContactMapper {
  static toDTO(record: Contact): ContactDTO {
    const { id, name, email, phone, isValid } = record.toJSON();

    return { id, name, email, phone, isValid };
  }

  static toPersistence(record: EntityDTO<Contact>): Contact {
    const { name, email, phone, isValid } = record;
    const contact = new Contact();

    contact.name = name ;
    contact.email = email;
    contact.phone = phone;
    contact.isValid = isValid;

    return contact;
  }

  static csvBufferToJSON(buffer: Buffer): Record<string, string>[] {
    const fileString = buffer.toString('utf8');

    try {
      const rows = fileString.split('\n');
      const headers = rows[0]?.replace('\r', '').split(',') ?? [];

      return rows.slice(1).map((row) => row
        .replace('\r', '')
        .split(',')
        .reduce((prev, value, i) => ({
          ...prev,
          [headers[i].toLowerCase() ?? '']: value,
        }), {} as Record<string, string>));
    } catch (e) {
      throw new Error('The format of file\'s content is incorrect');
    }
  }
}
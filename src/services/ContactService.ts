import { EntityDTO } from '@mikro-orm/core';
import axios from 'axios';

import { Contact } from '../db/entities/Contact';
import { ContactDTO } from '../dtos/ContactDTO';
import ContactMapper from '../mappers/ContactMapper';
import { VERIPHONE_URL, VERIPHONE_API_KEY } from '../config';
import { ContactRepository } from '../repositories/ContactRepository';

type VeriphoneResponse = { phone_valid: boolean };

export default class ContactService {
  static async validatePhone(phone: string): Promise<boolean> {
    const response = await axios.get<VeriphoneResponse>(VERIPHONE_URL, {
      params: {
        key: VERIPHONE_API_KEY,
        phone,
      },
    });

    return response.data?.phone_valid;
  }

  static async upload(rawContacts: Record<string, string>[]): Promise<ContactDTO[]> {
    const contacts: Contact[] = [];

    for (const rawContact of rawContacts) {
      const contact = ContactMapper.toPersistence(rawContact as unknown as EntityDTO<Contact>);

      const doesAlreadyExist = await ContactRepository.existsByPhone(contact.phone);
      if (doesAlreadyExist) continue;

      contact.isValid = await ContactService.validatePhone(contact.phone);
      contacts.push(contact);
    }

    await ContactRepository.insertBatch(contacts);
    const validContacts = await ContactRepository.findAllValid();

    return validContacts.map(validContact => ContactMapper.toDTO(validContact));
  }
}

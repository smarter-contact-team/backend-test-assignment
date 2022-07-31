import { Contact } from '../db/entities/Contact';
import DBManager from '../db';

export class ContactRepository {
  static insertBatch(contacts: Contact[]) {
    const entityManager = DBManager.getEntityManager();
    
    contacts.forEach((contact) => entityManager.persist(contact));
    return entityManager.flush();
  }

  static findAllValid() {
    const entityManager = DBManager.getEntityManager();

    return entityManager.find(Contact, { isValid: true });
  }

  static async existsByPhone(phone: string) {
    const entityManager = DBManager.getEntityManager();

    const count = await entityManager.count(Contact, { phone });
    return count > 0;
  }
}
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Contact extends BaseEntity<Contact, 'id'> {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ unique: true })
  phone!: string;

  @Property()
  isValid!: boolean;
}
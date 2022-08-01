import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Contacts extends BaseEntity<Contacts, 'id'> {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  phone!: string;

  @Property()
  isValid!: boolean;
}
import { MikroORM } from '@mikro-orm/core';
import { Migration20220726163314 } from '../migrations/Migration20220726163314';
import { Contacts } from './entities/Contacts';

void (async () => {
  const orm = await MikroORM.init({
    migrations: {
      migrationsList: [
        {
          name: 'Migration20220726163314.ts',
          class: Migration20220726163314,
        },
      ],
    },
    entities: [Contacts],
    dbName: 'test.db',
    type: 'sqlite',
  });

  await orm.close(true);
})();

export default {
  entities: [Contacts],
  dbName: 'test.db',
  type: 'sqlite',
};


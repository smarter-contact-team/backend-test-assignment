import { DBManager } from './DBManager';
import { MikroORM } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/core';

export default class SqliteDBManager implements DBManager {
  private entityManager: EntityManager | null = null;

  private orm: MikroORM | null = null;

  async init() {
    const orm = await MikroORM.init({
      migrations: {
        path: './migrations',
      },
    });
    this.orm = orm;
    this.entityManager = orm.em;
  }

  async close() {
    if (this.orm) {
      await this.orm.close();
    }
  }

  getEntityManager(): EntityManager {
    if (!this.entityManager) throw new Error('There is no active DB connection!');
    return this.entityManager.fork();
  }
}
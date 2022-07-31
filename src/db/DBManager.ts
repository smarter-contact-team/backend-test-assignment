import { EntityManager } from '@mikro-orm/core';

export interface DBManager {
  init(): Promise<void>
  getEntityManager(): EntityManager
  close(): Promise<void>
}
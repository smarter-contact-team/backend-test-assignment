import 'dotenv/config';
import { MikroORMOptions } from '@mikro-orm/core/utils/Configuration';

export class StorageConfig {

    // TODO add type checking and remove as any
    static fromEnv(): MikroORMOptions {
        if (!process.env.DB_ENTTITIES_TS) throw new Error("Parameter not found DB_ENTTITIES_TS");
        const entitiesTs = JSON.parse(process.env.DB_ENTTITIES_TS);

        if (!process.env.DB_ENTTITIES) throw new Error("Parameter not found DB_ENTTITIES");
        const entities = JSON.parse(process.env.DB_ENTTITIES);

        if (!process.env.DB_DBNAME) throw new Error("Parameter not found DB_DBNAME");
        const dbName = process.env.DB_DBNAME;

        if (!process.env.DB_TYPE) throw new Error("Parameter not found DB_TYPE");
        const type = process.env.DB_TYPE;

        const clientUrl = process.env.DB_CLIENT_URL;

        return { entitiesTs, entities, dbName, type, clientUrl } as any;
    }
}

import { getRequiredEnv } from './utils';

interface Config {
  api: ApiConfig;
  db: DbConfig;
}

interface ApiConfig {
  port: number;
}

interface DbConfig {
  uri: string;
}

export const config: Config = {
  api: {
    port: Number(getRequiredEnv('API_PORT')),
  },
  db: {
    uri: `mongodb://${getRequiredEnv('MONGO_INITDB_ROOT_USERNAME')}:${getRequiredEnv('MONGO_INITDB_ROOT_PASSWORD')}@${getRequiredEnv('DB_HOST')}:${getRequiredEnv('DB_PORT')}/${getRequiredEnv('MONGO_INITDB_DATABASE')}?authSource=admin`,
  },
};

import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
});

/**
 * Gets the required environment variable otherwise exits the process
 * @param key - Environment variable name/key
 * @returns The value of the environment variable if it exists
 */
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    Logger.error(`A variável de ambiente ${key} não está definida.`);
    process.exit(1);
  }
  return value;
};

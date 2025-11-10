// Register tsconfig paths before any imports that might use aliases
import { register } from 'tsconfig-paths';
import { join } from 'path';

register({
  baseUrl: join(__dirname, '../../'),
  paths: {
    '@/*': ['src/*'],
    '@modules/*': ['src/modules/*'],
  },
});

import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

ConfigModule.forRoot();
const configService = new ConfigService();

// Helper function to build connection configuration
const buildConnectionConfig = (): DataSourceOptions => {
  const databaseUrl = configService.get('DB_URL');

  // Base configuration shared by both connection methods
  const baseConfig: Partial<DataSourceOptions> = {
    type: 'postgres',
    entities: [__dirname + '/../**/**/*.orm-entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: process.env.NODE_ENV?.trim() === 'dev',
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
  };

  // If DATABASE_URL is provided, use it
  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
      // Enable SSL for production databases (common in cloud providers)
      ssl:
        process.env.NODE_ENV?.trim() === 'production'
          ? { rejectUnauthorized: false }
          : false,
    } as DataSourceOptions;
  }

  // Otherwise, use individual connection parameters
  return {
    ...baseConfig,
    host: configService.getOrThrow('DB_HOST'),
    port: configService.getOrThrow('DB_PORT'),
    username: configService.getOrThrow('DB_USER'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_NAME'),
  } as DataSourceOptions;
};

export const DataSourceConfig: DataSourceOptions = buildConnectionConfig();

export const AppDataSource: DataSource = new DataSource(DataSourceConfig);

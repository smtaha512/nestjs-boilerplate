import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  DatabaseConfig,
  DatabaseConfigInjectionKey,
} from '../config/database.config';
import { SrcConfig, SrcConfigInjectionKey } from '../config/src.config';

export const databaseProvider: Provider<DataSource> = {
  provide: 'DATA_SOURCE',
  useFactory: async (databaseConfig: DatabaseConfig, srcConfig: SrcConfig) => {
    const { srcFileExtension, srcRoot } = srcConfig;

    const dataSource = await new DataSource({
      entities: [`${srcRoot}/**/*.typeorm.entity.${srcFileExtension}`],
      migrations: [
        `${srcRoot}/database/migrations/**.migration.${srcFileExtension}`,
      ],
      schema: databaseConfig.databaseSchema,
      type: databaseConfig.type,
      url: databaseConfig.databaseUri,
      dropSchema: false,
      synchronize: false,
    }).initialize();

    await dataSource
      .createQueryRunner()
      .createSchema(databaseConfig.databaseSchema, /* ifNotExist = */ true);

    return dataSource;
  },
  inject: [DatabaseConfigInjectionKey, SrcConfigInjectionKey],
};

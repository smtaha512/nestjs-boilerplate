import { Logger, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigValidationSchema } from './config-validation.schema';
import { databaseConfig } from './database.config';
import { envConfig, envFilePaths } from './env.config';
import { srcConfig } from './src.config';

type GenericObject = Record<string, unknown>;
function validateEnvironmentConfig(config: GenericObject): GenericObject {
  const { error, value: validatedEnvConfig } = ConfigValidationSchema.validate(config, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    Logger.error('Error while parsing environment variables:', ConfigModule.name);
    Logger.error(error.message, ConfigModule.name);
    process.exit(1);
  }
  return validatedEnvConfig;
}

const envConfigsToLoad = [envConfig, databaseConfig, srcConfig];

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      load: envConfigsToLoad,
      validationSchema: ConfigValidationSchema,
      validationOptions: { abortEarly: true },
      validate: validateEnvironmentConfig,
    }),
  ],
})
export class ConfigModule {}

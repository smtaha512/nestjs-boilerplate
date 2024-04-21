import { Logger, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ConfigValidationSchema } from './config-validation.schema';
import { envConfig, envFilePaths } from './env.config';

type GenericObject = Record<string, any>;
function validateEnvironmentConfig(config: GenericObject): GenericObject {
  const { error, value: validatedEnvConfig } = ConfigValidationSchema.validate(
    config,
    { allowUnknown: true, stripUnknown: true },
  );

  if (error) {
    console.log(error.details);
    Logger.error(
      'Missing configuration. Please provide following variable:',
      ConfigService.name,
    );
    Logger.error(error.message, ConfigService.name);
    process.exit(1);
  }
  return validatedEnvConfig;
}

const envConfigsToLoad = [envConfig];

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      load: envConfigsToLoad,
      validationSchema: ConfigValidationSchema,
      validationOptions: { abortEarly: false },
      validate: validateEnvironmentConfig,
    }),
  ],
})
export class ConfigModule {}

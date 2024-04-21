import { Inject } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { KeysFromSnakeToCamelCase } from '../shared/types/utility-types';

type APP_TIMEZONE = 'UTC';
const validTimezones: APP_TIMEZONE[] = ['UTC'];

export interface EnvironmentVariables {
  ALLOWED_CORS_ORIGINS: string;
  CORS_MAX_AGE_IN_SECONDS: number;
  INVITATION_LINK_BASE_URL: string;
  JWT_SECRET_KEY: string;
  NODE_ENV: Environments;
  PORT: number;
  TZ: APP_TIMEZONE;
}

export type EnvConfig = KeysFromSnakeToCamelCase<EnvironmentVariables>;
export type EnvFilePath = `.env.${Environments}`;

export enum Environments {
  LOCAL = 'local',
  TESTING = 'testing',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging',
}

export const environments = Object.values(Environments);
export const envFilePaths: EnvFilePath[] = [
  Environments.PRODUCTION,
  Environments.STAGING,
  Environments.DEVELOPMENT,
  Environments.TESTING,
  Environments.LOCAL,
].map((env) => `.env.${env}` as EnvFilePath);

export const EnvConfigValidationSchema = Joi.object<EnvironmentVariables>({
  ALLOWED_CORS_ORIGINS: Joi.string().uri(),
  CORS_MAX_AGE_IN_SECONDS: Joi.number(),
  NODE_ENV: Joi.string()
    .valid(...environments)
    .required(),
  PORT: Joi.number().required(),
  TZ: Joi.string()
    .valid(...validTimezones)
    .required(),
});

export const ENV_CONFIG = 'ENV_CONFIG';
export const envConfig = registerAs<EnvConfig>(ENV_CONFIG, () => {
  const {
    env: {
      ALLOWED_CORS_ORIGINS,
      CORS_MAX_AGE_IN_SECONDS,
      INVITATION_LINK_BASE_URL,
      JWT_SECRET_KEY,
      NODE_ENV,
      PORT,
      TZ,
    },
  } = process;

  const config: EnvConfig = {
    allowedCorsOrigins: ALLOWED_CORS_ORIGINS!,
    corsMaxAgeInSeconds: +CORS_MAX_AGE_IN_SECONDS!,
    invitationLinkBaseUrl: INVITATION_LINK_BASE_URL!,
    jwtSecretKey: JWT_SECRET_KEY!,
    nodeEnv: NODE_ENV as Environments,
    port: +PORT!,
    tz: TZ as APP_TIMEZONE,
  };

  return config;
});

export const EnvConfigInjectionKey = envConfig.KEY;
export const InjectEnvConfig = Inject(EnvConfigInjectionKey);
export const EnvConfigFeatureModule = ConfigModule.forFeature(envConfig);

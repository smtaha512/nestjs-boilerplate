import * as Joi from 'joi';
import { DatabaseConfigValidationSchema } from './database.config';
import { EnvConfig, EnvConfigValidationSchema } from './env.config';

export type ConfigType = EnvConfig;

export const ConfigValidationSchema: Joi.ObjectSchema<ConfigType> = Joi.object()
  .concat(EnvConfigValidationSchema)
  .concat(DatabaseConfigValidationSchema);

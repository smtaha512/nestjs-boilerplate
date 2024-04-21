import * as Joi from 'joi';
import { EnvConfig, EnvConfigValidationSchema } from './env.config';

export type ConfigType = EnvConfig;

export const ConfigValidationSchema: Joi.ObjectSchema<ConfigType> =
  Joi.object().concat(EnvConfigValidationSchema);

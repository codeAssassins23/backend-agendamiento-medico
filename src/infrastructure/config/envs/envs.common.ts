import * as Joi from "joi";

export interface EnvCommon {
  TABLE_NAME: string;
  TOPIC_ARN: string;
}

const schema = Joi.object<EnvCommon>({
  TABLE_NAME: Joi.string().required(),
  TOPIC_ARN: Joi.string().required(),
}).unknown(true);

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`❌ Config validation error (common): ${error.message}`);
}

export const envCommon: EnvCommon = value;

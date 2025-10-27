import * as Joi from "joi";

export interface EnvPE {
  MYSQL_HOST_PE: string;
  MYSQL_DB_PE: string;
  MYSQL_USER_PE: string;
  MYSQL_PASSWORD_PE: string;
}

const schema = Joi.object<EnvPE>({
  MYSQL_HOST_PE: Joi.string().required(),
  MYSQL_DB_PE: Joi.string().required(),
  MYSQL_USER_PE: Joi.string().required(),
  MYSQL_PASSWORD_PE: Joi.string().required(),
}).unknown(true);

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`❌ Config validation error (PE): ${error.message}`);
}

export const envPE: EnvPE = value;

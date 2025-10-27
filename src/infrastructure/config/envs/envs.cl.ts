import * as Joi from "joi";

export interface EnvCL {
  MYSQL_HOST_CL: string;
  MYSQL_DB_CL: string;
  MYSQL_USER_CL: string;
  MYSQL_PASSWORD_CL: string;
}

const schema = Joi.object<EnvCL>({
  MYSQL_HOST_CL: Joi.string().required(),
  MYSQL_DB_CL: Joi.string().required(),
  MYSQL_USER_CL: Joi.string().required(),
  MYSQL_PASSWORD_CL: Joi.string().required(),
}).unknown(true);

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`❌ Config validation error (CL): ${error.message}`);
}

export const envCL: EnvCL = value;

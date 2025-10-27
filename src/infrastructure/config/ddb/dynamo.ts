import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { envCommon } from "../envs/envs.common";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });

export const ddbDoc = DynamoDBDocumentClient.from(ddb, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: { wrapNumbers: false },
});

export const TABLE: string = envCommon.TABLE_NAME;

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { envCommon } from "../config/envs/envs.common";

const sns = new SNSClient({ region: process.env.AWS_REGION });
const TOPIC_ARN = envCommon.TOPIC_ARN;

export async function publishAppointmentMessage(
  payload: any,
  countryISO: "PE" | "CL"
) {
  await sns.send(
    new PublishCommand({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(payload),
      MessageAttributes: {
        countryISO: { DataType: "String", StringValue: countryISO },
      },
    })
  );
  console.log("[SNS] Mensaje publicado", { countryISO, payload });
}

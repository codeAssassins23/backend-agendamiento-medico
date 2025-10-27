import { Appointment } from "../../domain/entities/appointment";
import { AppointmentRepository } from "../../domain/ports/appointment.repository";
import { ddbDoc, TABLE } from "../config/ddb/dynamo";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class AppointmentRepositoryImpl implements AppointmentRepository {
  async savePending(a: Appointment) {
    await ddbDoc.send(
      new PutCommand({
        TableName: TABLE,
        Item: a.toJSON(),
        ConditionExpression: "attribute_not_exists(appointmentId)",
      })
    );
  }

  async listByInsured(insuredId: string) {
    const res = await ddbDoc.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "insuredId = :i",
        ExpressionAttributeValues: { ":i": insuredId },
      })
    );
    return (res.Items ?? []) as any[];
  }

  async markCompleted(insuredId: string, appointmentId: string) {
    console.log("Marking appointment as completed", {
      insuredId,
      appointmentId,
    });
    await ddbDoc.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { insuredId, appointmentId },
        UpdateExpression: "SET #s = :c, updatedAt = :u",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":c": "COMPLETED",
          ":u": new Date().toISOString(),
        },
      })
    );
  }
}

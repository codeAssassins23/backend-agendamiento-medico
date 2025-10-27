import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

import { EventPublisher } from "../../domain/ports/eventPublisher";

const eb = new EventBridgeClient({
  region: process.env.AWS_REGION,
});

export class EventBridgePublisher implements EventPublisher {
  async publishCompleted(event: {
    appointmentId: string;
    insuredId: string;
    status: "COMPLETED";
  }): Promise<void> {
    await eb.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "appointments",
            DetailType: "AppointmentCompleted",
            Detail: JSON.stringify(event),
          },
        ],
      })
    );
  }
}

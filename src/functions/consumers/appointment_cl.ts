import type { SQSEvent, SQSHandler } from "aws-lambda";
import { ProcessAppointmentCL } from "../../application/use-cases/appointments/processAppointmentCL.usecase";
import { AppointmentCLRepository } from "../../infrastructure/repos/appointment-cl.repo";
import { EventBridgePublisher } from "../../infrastructure/messaging/eventbridge";

const uc = new ProcessAppointmentCL(
  new AppointmentCLRepository(),
  new EventBridgePublisher()
);

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const r of event.Records) {
    const body = JSON.parse(r.body);
    const { appointmentId, insuredId, scheduleId, countryISO } = body;

    console.log("[CL] procesando", {
      appointmentId,
      insuredId,
      scheduleId,
      countryISO,
    });

    try {
      await uc.exec({ appointmentId, insuredId, scheduleId, countryISO });
    } catch (err) {
      console.error("[CL] Error procesando", err);
      throw err;
    }
  }
};

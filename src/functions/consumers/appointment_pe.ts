import type { SQSEvent, SQSHandler } from "aws-lambda";
import { ProcessAppointmentPE } from "../../application/use-cases/appointments/processAppointmentPE.usecase";
import { AppointmentPERepository } from "../../infrastructure/repos/appointment-pe.repo";
import { EventBridgePublisher } from "../../infrastructure/messaging/eventbridge";

const uc = new ProcessAppointmentPE(
  new AppointmentPERepository(),
  new EventBridgePublisher()
);

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const r of event.Records) {
    const body = JSON.parse(r.body);
    const { appointmentId, insuredId, scheduleId, countryISO } = body;

    console.log("[PE] procesando", {
      appointmentId,
      insuredId,
      scheduleId,
      countryISO,
    });

    try {
      await uc.exec({ appointmentId, insuredId, scheduleId, countryISO });
    } catch (err) {
      console.error("[PE] Error procesando", err);
      throw err;
    }
  }
};

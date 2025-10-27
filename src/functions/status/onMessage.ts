import type { SQSEvent, SQSHandler } from "aws-lambda";
import { AppointmentRepositoryImpl } from "../../infrastructure/repos/appointment.repository";
import { MarkAppointmentCompleted } from "../../application/use-cases/appointments/markAppointmentCompleted.usecase";

const uc = new MarkAppointmentCompleted(new AppointmentRepositoryImpl());

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const r of event.Records) {
    try {
      const msg = JSON.parse(r.body);
      const { insuredId, appointmentId } = msg.detail ?? msg;

      console.log("[StatusConsumer] procesando", { insuredId, appointmentId });

      await uc.exec({ insuredId, appointmentId });

      console.log("[StatusConsumer] Marcado como COMPLETED", { appointmentId });
    } catch (err) {
      console.error("[StatusConsumer] Error procesando record", err);
    }
  }
};

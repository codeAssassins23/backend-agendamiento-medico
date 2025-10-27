import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { AppointmentRepositoryImpl } from "../../infrastructure/repos/appointment.repository";
import { CreateAppointment } from "../../application/use-cases/appointments/createAppointment.usecase";
import { publishAppointmentMessage } from "../../infrastructure/messaging/sns";

const CreateSchema = z.object({
  insuredId: z.string().regex(/^\d{5}$/),
  scheduleId: z.number().int().positive(),
  countryISO: z.enum(["PE", "CL"]),
});

const repo = new AppointmentRepositoryImpl();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const input = CreateSchema.parse(JSON.parse(event.body || "{}"));
    const uc = new CreateAppointment(repo);
    const saved = await uc.exec(input);
    await publishAppointmentMessage(
      { type: "APPOINTMENT_CREATED", ...saved },
      input.countryISO
    );
    return {
      statusCode: 202,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Agendamiento en proceso",
        appointmentId: saved.appointmentId,
      }),
    };
  } catch (err: any) {
    const code = err?.name === "ZodError" ? 400 : 500;
    return { statusCode: code, body: JSON.stringify({ error: err.message }) };
  }
};

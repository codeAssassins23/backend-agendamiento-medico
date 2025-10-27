import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AppointmentRepositoryImpl } from "../../infrastructure/repos/appointment.repository";
import { ListAppointments } from "../../application/use-cases/appointments/listAppointments.usecase";

const repo = new AppointmentRepositoryImpl();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const insuredId =
      event.pathParameters?.insuredId ??
      event.rawPath?.match(/\/appointments\/(\d{5})/)?.[1] ??
      "";

    if (!/^\d{5}$/.test(insuredId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "insuredId inválido" }),
      };
    }

    const uc = new ListAppointments(repo);
    const items = await uc.exec(insuredId);
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(items),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

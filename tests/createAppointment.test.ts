import { handler as createAppointment } from "../src/functions/appointments/createAppointment";
import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

jest.mock("../src/infrastructure/config/ddb/dynamo", () => {
  return {
    ddbDoc: { send: jest.fn().mockResolvedValue({}) },
    TABLE: "test-table",
  };
});

jest.mock("../src/infrastructure/messaging/sns", () => {
  return {
    publishAppointmentMessage: jest.fn().mockResolvedValue(undefined),
  };
});

describe("createAppointment", () => {
  it("guarda y responde 202 con appointmentId", async () => {
    const event: any = {
      body: JSON.stringify({
        insuredId: "00001",
        scheduleId: 200,
        countryISO: "PE",
      }),
    };

    const res = (await createAppointment(
      event,
      {} as any,
      () => {}
    )) as APIGatewayProxyStructuredResultV2;

    expect(res.statusCode).toBe(202);

    const payload = JSON.parse(res.body!);
    expect(payload.message).toBe("Agendamiento en proceso");
    expect(payload.appointmentId).toBeDefined();
  });

  it("devuelve 400 si payload inválido", async () => {
    const event: any = {
      body: JSON.stringify({
        insuredId: "abc",
        scheduleId: -1,
        countryISO: "AR",
      }),
    };

    const res = (await createAppointment(
      event,
      {} as any,
      () => {}
    )) as APIGatewayProxyStructuredResultV2;

    expect(res.statusCode).toBe(400);

    const payload = JSON.parse(res.body!);
    expect(payload.error).toBeDefined();
  });
});

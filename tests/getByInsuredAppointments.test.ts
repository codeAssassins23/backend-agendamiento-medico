import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { handler as getByInsured } from "../src/functions/appointments/getByInsuredAppointments";

jest.mock("../src/infrastructure/config/ddb/dynamo", () => {
  return {
    ddbDoc: {
      send: jest.fn().mockResolvedValue({
        Items: [
          {
            appointmentId: "test-001",
            insuredId: "00001",
            scheduleId: 200,
            status: "COMPLETED",
          },
        ],
      }),
    },
    TABLE: "test-table",
  };
});

describe("getByInsuredAppointments (mínimo)", () => {
  it("lista por insuredId y responde 200", async () => {
    const event: any = { pathParameters: { insuredId: "00001" } };

    const res = (await getByInsured(
      event,
      {} as any,
      () => {}
    )) as APIGatewayProxyStructuredResultV2;

    expect(res.statusCode).toBe(200);

    const items = JSON.parse(res.body!);
    expect(items).toHaveLength(1);
    expect(items[0].insuredId).toBe("00001");
  });
});

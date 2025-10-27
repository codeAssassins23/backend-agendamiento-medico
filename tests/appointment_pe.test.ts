const saveAppointmentMock = jest.fn();
const publishCompletedMock = jest.fn();

jest.mock("../src/infrastructure/repos/appointment-pe.repo", () => {
  return {
    AppointmentPERepository: jest.fn().mockImplementation(() => ({
      saveAppointment: saveAppointmentMock,
    })),
  };
});

jest.mock("../src/infrastructure/messaging/eventbridge", () => {
  return {
    EventBridgePublisher: jest.fn().mockImplementation(() => ({
      publishCompleted: publishCompletedMock,
    })),
  };
});

import { handler } from "../src/functions/consumers/appointment_pe";

describe("consumePE handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("procesa un record y guarda en repo + emite evento", async () => {
    saveAppointmentMock.mockResolvedValue(undefined);
    publishCompletedMock.mockResolvedValue(undefined);

    const event: any = {
      Records: [
        {
          body: JSON.stringify({
            appointmentId: "a1",
            insuredId: "00001",
            scheduleId: 200,
            countryISO: "PE",
          }),
        },
      ],
    };

    await handler(event, {} as any, () => {});

    expect(saveAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({ insuredId: "00001" })
    );
    expect(publishCompletedMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "COMPLETED" })
    );
  });

  it("lanza error si falla el repo", async () => {
    saveAppointmentMock.mockRejectedValue(new Error("fail"));
    publishCompletedMock.mockResolvedValue(undefined);

    const event: any = {
      Records: [
        {
          body: JSON.stringify({
            appointmentId: "a1",
            insuredId: "00001",
            scheduleId: 200,
            countryISO: "PE",
          }),
        },
      ],
    };

    await expect(handler(event, {} as any, () => {})).rejects.toThrow("fail");
  });
});

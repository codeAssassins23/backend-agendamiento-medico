import { randomUUID } from "crypto";
import { AppointmentRepository } from "../../../domain/ports/appointment.repository";
import { Appointment } from "../../../domain/entities/appointment";

export class CreateAppointment {
  constructor(private repo: AppointmentRepository) {}

  async exec(input: {
    insuredId: string;
    scheduleId: number;
    countryISO: "PE" | "CL";
  }) {
    const now = new Date().toISOString();
    const a = new Appointment({
      appointmentId: randomUUID(),
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      countryISO: input.countryISO,
      status: "PENDING",
      createdAt: now,
    });
    await this.repo.savePending(a);
    return a.toJSON();
  }
}

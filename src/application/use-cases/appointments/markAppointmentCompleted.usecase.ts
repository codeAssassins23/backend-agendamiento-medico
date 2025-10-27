import { AppointmentRepository } from "../../../domain/ports/appointment.repository";

export interface MarkAppointmentCompletedInput {
  insuredId: string;
  appointmentId: string;
}

export class MarkAppointmentCompleted {
  constructor(private readonly repo: AppointmentRepository) {}

  async exec(input: MarkAppointmentCompletedInput): Promise<void> {
    if (!input.appointmentId) {
      throw new Error("appointmentId requerido");
    }

    await this.repo.markCompleted(input.insuredId, input.appointmentId);
  }
}

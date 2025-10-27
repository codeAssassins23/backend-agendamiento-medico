import { AppointmentRepository } from "../../../domain/ports/appointment.repository";

export class ListAppointments {
  constructor(private repo: AppointmentRepository) {}
  async exec(insuredId: string) {
    return this.repo.listByInsured(insuredId);
  }
}

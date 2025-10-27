import { AppointmentCountryRepository } from "../../../domain/ports/appointmentCountry.repository";
import { EventPublisher } from "../../../domain/ports/eventPublisher";

export interface ProcessAppointmentPEInput {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
}

export class ProcessAppointmentPE {
  constructor(
    private readonly repo: AppointmentCountryRepository,
    private readonly publisher: EventPublisher
  ) {}

  async exec(input: ProcessAppointmentPEInput): Promise<void> {
    await this.repo.saveAppointment(input);

    await this.publisher.publishCompleted({
      appointmentId: input.appointmentId,
      insuredId: input.insuredId,
      status: "COMPLETED",
    });
  }
}

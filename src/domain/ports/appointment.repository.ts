import { Appointment } from "../entities/appointment";

export interface AppointmentRepository {
  savePending(a: Appointment): Promise<void>;
  listByInsured(insuredId: string): Promise<Appointment[]>;
  markCompleted(insuredId: string, appointmentId: string): Promise<void>;
}

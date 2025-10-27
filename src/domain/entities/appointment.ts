export type CountryISO = "PE" | "CL";
export type AppointmentStatus = "PENDING" | "COMPLETED";

export interface AppointmentProps {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
}

export class Appointment {
  constructor(private p: AppointmentProps) {}
  toJSON() {
    return this.p;
  }
}

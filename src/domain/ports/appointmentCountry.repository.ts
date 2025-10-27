export interface AppointmentCountryRepository {
  saveAppointment(data: {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  }): Promise<void>;
}

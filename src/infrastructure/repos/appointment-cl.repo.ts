import { getPoolCL } from "../config/rds/mysql.cl";
import { AppointmentCountryRepository } from "../../domain/ports/appointmentCountry.repository";

export class AppointmentCLRepository implements AppointmentCountryRepository {
  async saveAppointment(p: {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  }): Promise<void> {
    try {
      console.log("Inserting appointment into CL", p);
      const pool = getPoolCL();
      await pool.execute(
        `INSERT INTO appointments (appointmentId, insuredId, scheduleId, countryISO)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         insuredId = VALUES(insuredId),
         scheduleId = VALUES(scheduleId),
         countryISO = VALUES(countryISO)`,
        [p.appointmentId, p.insuredId, p.scheduleId, p.countryISO]
      );
      console.log("Appointment inserted into CL successfully");
    } catch (error) {
      console.error("Error inserting appointment into CL", error);
      throw error;
    }
  }
}

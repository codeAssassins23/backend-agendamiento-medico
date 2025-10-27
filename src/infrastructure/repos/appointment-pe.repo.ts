import { AppointmentCountryRepository } from "../../domain/ports/appointmentCountry.repository";
import { getPoolPE } from "../config/rds/mysql.pe";

export class AppointmentPERepository implements AppointmentCountryRepository {
  async saveAppointment(p: {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  }): Promise<void> {
    try {
      console.log("Inserting appointment into PE", p);
      const pool = getPoolPE();
      await pool.execute(
        `INSERT INTO appointments (appointmentId, insuredId, scheduleId, countryISO)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         insuredId = VALUES(insuredId),
         scheduleId = VALUES(scheduleId),
         countryISO = VALUES(countryISO)`,
        [p.appointmentId, p.insuredId, p.scheduleId, p.countryISO]
      );
      console.log("Appointment inserted into PE successfully");
    } catch (error) {
      console.error("Error inserting appointment into PE", error);
      throw error;
    }
  }
}

// src/server/storage-appointments.ts
import type {
  Appointment,
  InsertAppointment,
  AppointmentStatus,
} from "@shared/schema";

export interface AppointmentStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsFiltered(params: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: AppointmentStatus;
    serviceType?: string;
    search?: string;
  }): Promise<Appointment[]>;

  // ✅ NEW
  deleteAppointment(id: number): Promise<Appointment | null>;
}

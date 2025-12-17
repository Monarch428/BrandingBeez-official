// shared/schema/appointments.ts

export type AppointmentStatus = "booked" | "cancelled" | "completed";

export interface Appointment {
  id: number;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  notes?: string;

  date: string;
  startTime: string;
  endTime: string;

  meetingLink?: string;

  // NEW: guests
  guestEmails?: string[];
  event?: string;

  status: AppointmentStatus;

  createdAt: Date;
  updatedAt?: Date;
}

export type InsertAppointment = Omit<
  Appointment,
  "id" | "status" | "createdAt" | "updatedAt"
>;

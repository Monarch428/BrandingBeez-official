// src/services/appointmentService.ts
export type SlotStatus = "available" | "booked" | "cancelled" | "completed";

export interface DaySlot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  appointmentId?: number;
}

export interface SlotsResponse {
  date: string;
  slots: DaySlot[];
}

export interface CreateAppointmentPayload {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  notes?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export async function fetchSlots(date: string): Promise<SlotsResponse> {
  const res = await fetch(`/api/appointments/slots?date=${date}`);
  if (!res.ok) {
    throw new Error("Failed to load slots");
  }
  return res.json();
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create appointment");
  }

  return res.json();
}

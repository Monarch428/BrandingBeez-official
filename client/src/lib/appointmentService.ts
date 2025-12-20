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
  /**
   * Main + additional services can be combined into a single string
   * e.g. "Website Development; SEO / AIO Services"
   */
  serviceType?: string;
  notes?: string;

  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm

  /**
   * NEW: Guest emails for additional attendees
   * Frontend can send this as an array of emails collected from the "Add guest" textarea.
   */
  guestEmails?: string[];
}

export async function fetchSlots(date: string): Promise<SlotsResponse> {
  console.log("Fetching slots for date:", date);

  const res = await fetch(`/api/appointments/slots?date=${date}`);

  // console.log("Slots response HTTP status:", res.status);

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    console.error("Failed to load slots, body:", errBody);
    throw new Error(errBody?.message || "Failed to load slots");
  }

  const data = (await res.json()) as SlotsResponse;
  console.log("Slots response JSON:", data);

  return data;
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  // console.log("Creating appointment with payload:", payload);

  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // console.log("Create appointment HTTP status:", res.status);

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    console.error("Failed to create appointment, body:", data);
    throw new Error(data.message || "Failed to create appointment");
  }

  console.log("Created appointment:", data);
  return data;
}

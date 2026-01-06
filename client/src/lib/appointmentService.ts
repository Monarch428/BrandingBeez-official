// src/services/appointmentService.ts

export type SlotStatus = "available" | "booked" | "cancelled" | "completed";

export interface DaySlot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  appointmentId?: number;

  // ✅ NEW: from backend (calendar busy)
  blockedByCalendar?: boolean;
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

  guestEmails?: string[];

  bookedFromTimeZone?: string;
  bookedFromTimeZoneLabel?: string;
}

export async function fetchSlots(date: string): Promise<SlotsResponse> {
  console.log("Fetching slots for date:", date);

  const res = await fetch(
    `/api/appointments/slots?date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // Parse JSON once
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    console.error("Failed to load slots, body:", body);

    const msg =
      body?.message ||
      `Failed to load slots (HTTP ${res.status})`;

    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  const data = body as SlotsResponse;
  console.log("Slots response JSON:", data);

  return data;
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    console.error("Failed to create appointment, body:", data);
    throw new Error(data.message || "Failed to create appointment");
  }

  console.log("Created appointment:", data);
  return data;
}

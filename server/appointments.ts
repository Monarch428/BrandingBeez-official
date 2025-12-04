// import express, { Request, Response } from "express";
// import { storage } from "./storage";
// import { sendAppointmentNotification } from "./email-service";

// const router = express.Router();

// // --- Types -------------------------------------------------------

// type AppointmentStatus = "booked" | "cancelled" | "completed";

// interface AppointmentSlot {
//   startTime: string; // "HH:mm"
//   endTime: string;   // "HH:mm"
//   status: "available" | AppointmentStatus;
//   appointmentId?: number;
// }

// interface CreateAppointmentBody {
//   name: string;
//   email: string;
//   phone?: string;
//   serviceType?: string;
//   notes?: string;
//   date: string;       // "YYYY-MM-DD"
//   startTime: string;  // "HH:mm"
//   endTime: string;    // "HH:mm"
// }

// // Generates 30-minute slots between 09:00 and 17:00
// function generateDailySlots(): Array<Pick<AppointmentSlot, "startTime" | "endTime">> {
//   const slots: { startTime: string; endTime: string }[] = [];
//   let hour = 9;
//   let minute = 0;

//   while (hour < 17) {
//     const start = `${hour.toString().padStart(2, "0")}:${minute
//       .toString()
//       .padStart(2, "0")}`;

//     let endHour = hour;
//     let endMinute = minute + 30;
//     if (endMinute >= 60) {
//       endMinute -= 60;
//       endHour += 1;
//     }

//     const end = `${endHour.toString().padStart(2, "0")}:${endMinute
//       .toString()
//       .padStart(2, "0")}`;

//     slots.push({ startTime: start, endTime: end });

//     hour = endHour;
//     minute = endMinute;
//   }

//   return slots;
// }

// // --- GET /api/appointments/slots?date=YYYY-MM-DD ------------------
// // (assuming this router is mounted at /api)
// router.get("/appointments/slots", async (req: Request, res: Response) => {
//   try {
//     const date = (req.query.date as string) || "";

//     if (!date) {
//       return res.status(400).json({ message: "date query param is required" });
//     }

//     // You may add extra validation for date format here if you like

//     const appointments = await storage.getAppointmentsByDate(date);
//     const baseSlots = generateDailySlots();

//     const slots: AppointmentSlot[] = baseSlots.map((slot) => {
//       const found = appointments.find(
//         (a) =>
//           a.startTime === slot.startTime &&
//           a.endTime === slot.endTime &&
//           a.status !== "cancelled",
//       );

//       if (!found) {
//         return {
//           ...slot,
//           status: "available",
//         };
//       }

//       return {
//         ...slot,
//         status: found.status as AppointmentStatus, // booked | cancelled | completed
//         appointmentId: found.id,
//       };
//     });

//     return res.json({ date, slots });
//   } catch (err) {
//     console.error("Error getting slots", err);
//     return res.status(500).json({ message: "Error fetching slots" });
//   }
// });

// // --- POST /api/appointments ---------------------------------------
// router.post("/appointments", async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       serviceType,
//       notes,
//       date,
//       startTime,
//       endTime,
//     } = (req.body || {}) as CreateAppointmentBody;

//     // Basic validation
//     if (!name || !email || !date || !startTime || !endTime) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check if slot already booked (booked or completed – ignore cancelled)
//     const existing = await storage.getAppointmentsByDate(date);
//     const clash = existing.find(
//       (a) =>
//         a.startTime === startTime &&
//         a.endTime === endTime &&
//         a.status !== "cancelled",
//     );

//     if (clash) {
//       return res
//         .status(409)
//         .json({ message: "This time slot is already booked" });
//     }

//     const created = await storage.createAppointment({
//       name,
//       email,
//       phone,
//       serviceType,
//       notes,
//       date,
//       startTime,
//       endTime,
//     });

//     // 📧 Fire-and-forget email to Pradeep (admin)
//     try {
//       await sendAppointmentNotification({
//         id: created.id,
//         name: created.name,
//         email: created.email,
//         phone: created.phone,
//         serviceType: (created as any).serviceType,
//         notes: (created as any).notes,
//         date: created.date,
//         startTime: created.startTime,
//         endTime: created.endTime,
//         createdAt: (created as any).createdAt || new Date(),
//       });
//     } catch (mailErr) {
//       console.error("Error sending appointment notification:", mailErr);
//       // Do NOT fail the booking if email fails
//     }

//     return res.status(201).json(created);
//   } catch (err) {
//     console.error("Error creating appointment", err);
//     return res.status(500).json({ message: "Error creating appointment" });
//   }
// });

// // --- Admin: list all appointments ---------------------------------
// router.get("/admin/appointments", async (_req: Request, res: Response) => {
//   try {
//     const all = await storage.getAllAppointments();
//     return res.json(all);
//   } catch (err) {
//     console.error("Error fetching appointments", err);
//     return res.status(500).json({ message: "Error fetching appointments" });
//   }
// });

// // --- Admin: update status -----------------------------------------
// router.patch(
//   "/admin/appointments/:id/status",
//   async (req: Request, res: Response) => {
//     try {
//       const id = Number(req.params.id);
//       const { status } = req.body as { status?: AppointmentStatus };

//       if (!status || !["booked", "cancelled", "completed"].includes(status)) {
//         return res.status(400).json({ message: "Invalid status" });
//       }

//       const updated = await storage.updateAppointmentStatus(id, status);
//       return res.json(updated);
//     } catch (err) {
//       console.error("Error updating appointment status", err);
//       return res
//         .status(500)
//         .json({ message: "Error updating appointment status" });
//     }
//   },
// );

// export default router;




// --------------------------------------------------------------------------------- //


import express, { Request, Response } from "express";
import { storage } from "./storage";
import { sendAppointmentNotification } from "./email-service";
import { createGoogleMeetEvent } from "./google-calendar";

const router = express.Router();

// --- Types -------------------------------------------------------

type AppointmentStatus = "booked" | "cancelled" | "completed";

interface AppointmentSlot {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  status: "available" | AppointmentStatus;
  appointmentId?: number;
}

interface CreateAppointmentBody {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  notes?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

// Generates 30-minute slots between 16:00 (4 PM) and 23:00 (11 PM)
function generateDailySlots(): Array<
  Pick<AppointmentSlot, "startTime" | "endTime">
> {
  const slots: { startTime: string; endTime: string }[] = [];

  // Start at 16:00 (4 PM)
  let hour = 16;
  let minute = 0;

  // End at 23:00 – last slot will be 22:30–23:00
  while (hour < 23) {
    const start = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    let endHour = hour;
    let endMinute = minute + 30;
    if (endMinute >= 60) {
      endMinute -= 60;
      endHour += 1;
    }

    const end = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    slots.push({ startTime: start, endTime: end });

    hour = endHour;
    minute = endMinute;
  }

  return slots;
}

// --- GET /api/appointments/slots?date=YYYY-MM-DD ------------------
// (assuming this router is mounted at /api)
router.get("/appointments/slots", async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || "";

    if (!date) {
      return res.status(400).json({ message: "date query param is required" });
    }

    // You may add extra validation for date format here if you like

    const appointments = await storage.getAppointmentsByDate(date);
    const baseSlots = generateDailySlots();

    const slots: AppointmentSlot[] = baseSlots.map((slot) => {
      const found = appointments.find(
        (a) =>
          a.startTime === slot.startTime &&
          a.endTime === slot.endTime &&
          a.status !== "cancelled",
      );

      if (!found) {
        return {
          ...slot,
          status: "available",
        };
      }

      return {
        ...slot,
        status: found.status as AppointmentStatus,
        appointmentId: found.id,
      };
    });

    return res.json({ date, slots });
  } catch (err) {
    console.error("Error getting slots", err);
    return res.status(500).json({ message: "Error fetching slots" });
  }
});

// --- POST /api/appointments ---------------------------------------
router.post("/appointments", async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      serviceType,
      notes,
      date,
      startTime,
      endTime,
    } = (req.body || {}) as CreateAppointmentBody;

    // Basic validation
    if (!name || !email || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if slot already booked (booked or completed – ignore cancelled)
    const existing = await storage.getAppointmentsByDate(date);
    const clash = existing.find(
      (a) =>
        a.startTime === startTime &&
        a.endTime === endTime &&
        a.status !== "cancelled",
    );

    if (clash) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    // ✅ Try to create Google Meet event
    let meetingLink: string | undefined;

    try {
      const summary = serviceType
        ? `BrandingBeez – ${serviceType} with ${name}`
        : `BrandingBeez – Consultation with ${name}`;

      const descriptionLines: string[] = [];
      descriptionLines.push(`Name: ${name}`);
      descriptionLines.push(`Email: ${email}`);
      if (phone) descriptionLines.push(`Phone: ${phone}`);
      if (serviceType) descriptionLines.push(`Service: ${serviceType}`);
      if (notes) descriptionLines.push(`Notes: ${notes}`);
      const description = descriptionLines.join("\n");

      const { meetingLink: createdLink } = await createGoogleMeetEvent({
        summary,
        description,
        date,
        startTime,
        endTime,
        attendeeEmail: email,
        attendeeName: name,
      });

      meetingLink = createdLink;
    } catch (gErr) {
      console.error(
        "[Appointments] Failed to create Google Meet event (booking continues):",
        gErr,
      );
      // do NOT throw; booking should still succeed
    }

    const created = await storage.createAppointment({
      name,
      email,
      phone,
      serviceType,
      notes,
      date,
      startTime,
      endTime,
      meetingLink,
    });

    // 📧 Fire-and-forget email to Pradeep (admin)
    try {
      await sendAppointmentNotification({
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        serviceType: (created as any).serviceType,
        notes: (created as any).notes,
        date: created.date,
        startTime: created.startTime,
        endTime: created.endTime,
        meetingLink: (created as any).meetingLink,
        createdAt: (created as any).createdAt || new Date(),
      });
    } catch (mailErr) {
      console.error("Error sending appointment notification:", mailErr);
      // Do NOT fail the booking if email fails
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating appointment", err);
    return res.status(500).json({ message: "Error creating appointment" });
  }
});

// --- Admin: list all appointments ---------------------------------
router.get("/admin/appointments", async (_req: Request, res: Response) => {
  try {
    const all = await storage.getAllAppointments();
    return res.json(all);
  } catch (err) {
    console.error("Error fetching appointments", err);
    return res.status(500).json({ message: "Error fetching appointments" });
  }
});

// --- Admin: update status -----------------------------------------
router.patch(
  "/admin/appointments/:id/status",
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status?: AppointmentStatus };

      if (!status || !["booked", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updated = await storage.updateAppointmentStatus(id, status);
      return res.json(updated);
    } catch (err) {
      console.error("Error updating appointment status", err);
      return res
        .status(500)
        .json({ message: "Error updating appointment status" });
    }
  },
);

export default router;

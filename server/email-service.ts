// server/email-services.ts
import path from "path";
import nodemailer from "nodemailer";
import { notificationService } from "./notification-service";

type EmailTransportMethod = "smtp" | "console_log";

/**
 * NOTE: Your code uses a shared SMTP config pattern.
 * Some providers require:
 * - port 465 => secure true
 * - port 587 => secure false (STARTTLS)
 */

/* =========================
   HELPERS
========================= */

const slugifyFilename = (value: string) =>
  value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/--+/g, "-")
    .slice(0, 80) || "attachment";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  // ⚠️ Your existing code used secure: true (works only for 465 typically)
  // Keeping existing functions unchanged per your instruction.
  return { host, port, user, pass };
}

function resolveFromAddress(defaultUser: string) {
  return process.env.SMTP_FROM || defaultUser;
}

/* =========================
   EXISTING: CONTACT NOTIFICATION
========================= */

export async function sendContactNotification(payload: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  submittedAt: Date;
}): Promise<{ success: boolean; method: EmailTransportMethod }> {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Contact Notification");
    console.log(payload);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // existing behavior
    auth: { user, pass },
  });

  const subject = `New Contact Form Submission - ${payload.name}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">New Contact Submission</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${payload.phone}</p>` : ""}
      ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
      ${payload.message ? `<p><strong>Message:</strong><br/>${payload.message}</p>` : ""}
      <p style="color:#6b7280; font-size:12px;">Submitted at: ${payload.submittedAt.toISOString()}</p>
    </div>
  `;

  await transporter.sendMail({
    from: resolveFromAddress(user),
    to: process.env.CONTACT_NOTIFY_TO || user,
    subject,
    html,
  });

  return { success: true, method: "smtp" };
}

/* =========================
   EXISTING: BUSINESS GROWTH REPORT EMAIL (PDF ATTACHMENT)
========================= */

export async function sendBusinessGrowthReportEmail(payload: {
  toEmail: string;
  toName: string;
  analysis: any;
  pdfBuffer: Buffer;
}): Promise<{ success: boolean; method: EmailTransportMethod }> {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Business Growth Report Email");
    console.log("To:", payload.toEmail, "Name:", payload.toName);
    console.log("Analysis:", payload.analysis);
    console.log("PDF bytes:", payload.pdfBuffer?.length || 0);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // existing behavior
    auth: { user, pass },
  });

  const company = payload.analysis?.reportMetadata?.companyName || "your business";
  const subject = `Your Business Growth Report is ready – ${company}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">Hi ${payload.toName || "there"},</h2>
      <p>Your <strong>AI Business Growth Analysis Report</strong> is ready.</p>
      <p>We’ve attached the PDF to this email.</p>
      <p style="margin:16px 0 0; color:#6b7280; font-size:12px;">
        If you have any questions, just reply to this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: resolveFromAddress(user),
    to: payload.toEmail,
    subject,
    html,
    attachments: [
      {
        filename: "Business-Growth-Report.pdf",
        content: payload.pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return { success: true, method: "smtp" };
}

/* =========================
   EXISTING: APPOINTMENT NOTIFICATION
========================= */

export interface AppointmentNotificationPayload {
  date: string;
  startTime: string;
  endTime: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  meetingTitle?: string;
  meetingDescription?: string;
  timeZone?: string;
  guests?: { name?: string; email: string }[];
}

export async function sendAppointmentNotification(
  appt: AppointmentNotificationPayload,
): Promise<{ success: boolean; method: EmailTransportMethod }> {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Appointment Notification");
    console.log(appt);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // existing behavior
    auth: { user, pass },
  });

  const subject = `New Appointment Booked – ${appt.date} ${appt.startTime}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">New Appointment Booked</h2>
      <p><strong>Date:</strong> ${appt.date}</p>
      <p><strong>Time:</strong> ${appt.startTime} - ${appt.endTime} ${appt.timeZone ? `(${appt.timeZone})` : ""}</p>
      <p><strong>Attendee:</strong> ${appt.attendeeName} (${appt.attendeeEmail})</p>
      ${appt.attendeePhone ? `<p><strong>Phone:</strong> ${appt.attendeePhone}</p>` : ""}
      ${appt.meetingTitle ? `<p><strong>Title:</strong> ${appt.meetingTitle}</p>` : ""}
      ${appt.meetingDescription ? `<p><strong>Description:</strong><br/>${appt.meetingDescription}</p>` : ""}
      ${
        appt.guests?.length
          ? `<p><strong>Guests:</strong> ${appt.guests.map((g) => g.email).join(", ")}</p>`
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from: resolveFromAddress(user),
    to: process.env.APPOINTMENT_NOTIFY_TO || user,
    subject,
    html,
  });

  return { success: true, method: "smtp" };
}

export async function sendAppointmentConfirmationToAttendee(
  appt: AppointmentNotificationPayload,
): Promise<{ success: boolean; method: EmailTransportMethod }> {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Appointment Confirmation (Attendee)");
    console.log(appt);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // existing behavior
    auth: { user, pass },
  });

  const prettyDate = appt.date;
  const prettyTime = `${appt.startTime} – ${appt.endTime}`;
  const subject = `Appointment confirmed – ${prettyDate} @ ${prettyTime}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">Hi ${appt.attendeeName || "there"},</h2>
      <p>Your appointment has been confirmed.</p>
      <p><strong>Date:</strong> ${prettyDate}</p>
      <p><strong>Time:</strong> ${prettyTime} ${appt.timeZone ? `(${appt.timeZone})` : ""}</p>
      ${appt.meetingTitle ? `<p><strong>Title:</strong> ${appt.meetingTitle}</p>` : ""}
      ${appt.meetingDescription ? `<p><strong>Details:</strong><br/>${appt.meetingDescription}</p>` : ""}
      <p style="margin:16px 0 0; color:#6b7280; font-size:12px;">
        If you need to reschedule, reply to this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: resolveFromAddress(user),
    to: appt.attendeeEmail,
    subject,
    html,
  });

  return { success: true, method: "smtp" };
}

export async function sendAppointmentConfirmationToGuests(
  appt: AppointmentNotificationPayload,
): Promise<{ success: boolean; method: EmailTransportMethod }> {
  const guestEmails = (appt.guests || [])
    .map((g) => g?.email)
    .filter(Boolean) as string[];

  if (!guestEmails.length) return { success: true, method: "console_log" };

  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Appointment Confirmation (Guests)");
    console.log(appt);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // existing behavior
    auth: { user, pass },
  });

  const prettyDate = appt.date;
  const prettyTime = `${appt.startTime} – ${appt.endTime}`;
  const subject = `You've been added as a guest – ${prettyDate} @ ${prettyTime}`;

  const html = (guestEmail: string) => `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">Hi,</h2>
      <p>You have been added as a guest to an appointment.</p>
      <p><strong>Date:</strong> ${prettyDate}</p>
      <p><strong>Time:</strong> ${prettyTime} ${appt.timeZone ? `(${appt.timeZone})` : ""}</p>
      <p><strong>Attendee:</strong> ${appt.attendeeName} (${appt.attendeeEmail})</p>
      ${appt.meetingTitle ? `<p><strong>Title:</strong> ${appt.meetingTitle}</p>` : ""}
      ${appt.meetingDescription ? `<p><strong>Details:</strong><br/>${appt.meetingDescription}</p>` : ""}
      <p style="margin:16px 0 0; color:#6b7280; font-size:12px;">
        This email was sent to ${guestEmail}.
      </p>
    </div>
  `;

  for (const guestEmail of guestEmails) {
    await transporter.sendMail({
      from: resolveFromAddress(user),
      to: guestEmail,
      subject,
      html: html(guestEmail),
    });
    console.log("✅ Guest confirmation sent to", guestEmail);
  }

  return { success: true, method: "smtp" };
}

// ✅ Wrapper if you want one call from router
export async function sendAppointmentConfirmationEmails(
  appt: AppointmentNotificationPayload,
) {
  await sendAppointmentConfirmationToAttendee(appt);
  await sendAppointmentConfirmationToGuests(appt);
}

/* =======================================================================================
   ✅ ADDED ONLY: AI BUSINESS GROWTH REPORT (WITH DOWNLOAD LINK + FIXED SECURE/PORT)
   - DOES NOT MODIFY existing functions.
======================================================================================= */

function getSmtpConfigWithSecure() {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  // Port 465 => implicit TLS
  // Port 587/25 => STARTTLS (secure false; Nodemailer upgrades automatically)
  const secure = port === 465;

  return { host, port, secure, user, pass };
}

export async function sendBusinessGrowthReportEmailWithDownload({
  toEmail,
  toName,
  analysis,
  pdfBuffer,
  downloadUrl,
}: {
  toEmail: string;
  toName: string;
  analysis: any;
  pdfBuffer: Buffer;
  downloadUrl: string;
}): Promise<{ success: boolean; method: EmailTransportMethod }> {
  if (!toEmail) throw new Error("toEmail is required");

  const { host, port, secure, user, pass } = getSmtpConfigWithSecure();

  if (!host || !user || !pass) {
    console.log("[EMAIL DEV MODE] Business Growth Report Email (With Download Link)");
    console.log("To:", toEmail, "Name:", toName);
    console.log("Download:", downloadUrl);
    console.log("PDF bytes:", pdfBuffer?.length || 0);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const company = analysis?.reportMetadata?.companyName || "your business";
  const website = analysis?.reportMetadata?.website || "";
  const score =
    typeof analysis?.reportMetadata?.overallScore === "number"
      ? analysis.reportMetadata.overallScore
      : undefined;

  const subject = `Your Business Growth Report is ready – ${company}`;

  const safeFilenameBase = slugifyFilename(company || "business-growth-report");
  const filename = `${safeFilenameBase}-report.pdf`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 10px;">Hi ${toName || "there"},</h2>
      <p style="margin:0 0 10px;">
        Your <strong>AI Business Growth Analysis Report</strong> is ready.
      </p>
      ${website ? `<p style="margin:0 0 10px;">Website: <a href="${website}" target="_blank" rel="noreferrer">${website}</a></p>` : ""}
      ${typeof score === "number" ? `<p style="margin:0 0 10px;">Overall score: <strong>${score}/100</strong></p>` : ""}

      <div style="margin:18px 0;">
        <a href="${downloadUrl}" style="display:inline-block; background:#2563eb; color:white; padding:10px 14px; border-radius:8px; text-decoration:none;">
          Download your PDF report
        </a>
      </div>

      <p style="margin:0 0 10px;">
        We’ve attached the PDF to this email as well.
      </p>

      <p style="margin:16px 0 0; color:#6b7280; font-size:12px;">
        If you have any questions, just reply to this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: resolveFromAddress(user),
    to: toEmail,
    subject,
    html,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return { success: true, method: "smtp" };
}

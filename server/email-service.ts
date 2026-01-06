import path from "path";
import nodemailer from "nodemailer";
import { notificationService } from "./notification-service";

interface AppointmentNotificationPayload {
  id: number;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  notes?: string;

  // Host slot (IST-based slots)
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm

  createdAt?: Date;
  meetingLink?: string;
  guestEmails?: string[];

  // ✅ NEW: which timezone user selected in booking UI
  bookedFromTimeZone?: string;       // IANA e.g. "Asia/Dubai"
  bookedFromTimeZoneLabel?: string;  // Friendly label e.g. "Dubai Time"
}

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  submittedAt: Date;
}

// 🔐 Global SMTP envs
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASSWORD || "";

// ✅ Branded "From" helpers (this fixes the sender showing as just "info")
const FROM_APPOINTMENTS = (email?: string) =>
  `"BrandingBeez – Appointments" <${email || "info@brandingbeez.co.uk"}>`;

const FROM_NEWSLETTER = (email?: string) =>
  `"BrandingBeez Newsletter" <${email || "info@brandingbeez.co.uk"}>`;

const FROM_QUESTIONNAIRE = (email?: string) =>
  `"BrandingBeez – Custom Apps" <${email || "info@brandingbeez.co.uk"}>`;

/**
 * ✅ Date/time formatting helpers
 * Host slot is in IST (Asia/Kolkata).
 * Attendee email must show the time in bookedFromTimeZone (or fallback).
 */

const HOST_TZ = process.env.HOST_TIMEZONE || "Asia/Kolkata";

function buildHostSlotInstantISO(date: string, timeHHMM: string) {
  // Date/time is IST slot -> pin with +05:30
  return `${date}T${timeHHMM}:00+05:30`;
}

function safeTimeZone(tz?: string) {
  return typeof tz === "string" && tz.trim().length > 0 ? tz.trim() : "";
}

function formatDateLabel(dateISO: string, timeZone: string) {
  // input YYYY-MM-DD -> build noon-ish to avoid edge issues
  const d = new Date(`${dateISO}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone,
  }).format(d);
}

function formatTimeRangeInTimeZone(
  date: string,
  startTime: string,
  endTime: string,
  timeZone: string,
) {
  const tz = safeTimeZone(timeZone) || HOST_TZ;

  const start = new Date(buildHostSlotInstantISO(date, startTime));
  const end = new Date(buildHostSlotInstantISO(date, endTime));

  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  });

  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function getSmtpConfig() {
  let host = process.env.SMTP_HOST || "";
  let port = process.env.SMTP_PORT || "";

  if (!host) {
    if (SMTP_USER.toLowerCase().endsWith("@gmail.com")) {
      host = "smtp.gmail.com";
    } else {
      host = "smtppro.zoho.in";
    }
  }

  if (!port) {
    port = "465";
  }

  return {
    host,
    port: Number(port),
    user: SMTP_USER || undefined,
    pass: SMTP_PASS || undefined,
  };
}

// Simple email notification using nodemailer (works with Gmail, Outlook, etc.)
export async function sendContactNotification(submission: ContactSubmission) {
  notificationService.addNotification("contact_form", {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    phone: submission.phone,
    message: submission.message,
    submittedAt: submission.submittedAt,
  });

  console.log("\n🔥 NEW CONTACT FORM SUBMISSION 🔥");
  console.log(
    "Time:",
    new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }),
  );
  console.log("Name:", submission.name);
  console.log("Email:", submission.email);
  console.log("Company:", submission.company || "Not provided");
  console.log("Phone:", submission.phone || "Not provided");
  console.log("Message:", submission.message);
  console.log("=====================================\n");

  try {
    await notificationService.sendWebhook(
      `New contact form submission from ${submission.name} (${submission.email})`,
      submission,
    );
  } catch (error) {
    console.error("Webhook notification failed:", error);
  }

  return { success: true, method: "console_log_and_memory" };
}

// Send a full questionnaire to the admin email as a text attachment
export async function sendQuestionnaireToAdmin(submission: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  questionnaire: any;
  submittedAt?: Date;
  file?: { path: string; originalname?: string; mimetype?: string };
}) {
  notificationService.addNotification("custom_app_questionnaire", {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    phone: submission.phone,
    questionnaire: submission.questionnaire,
    submittedAt: submission.submittedAt || new Date(),
  });

  const { host, port, user, pass } = getSmtpConfig();

  const adminEmail = "info@brandingbeez.co.uk";

  const lines: string[] = [];
  lines.push("Custom App Questionnaire Submission");
  lines.push(
    "Submitted At: " + (submission.submittedAt || new Date()).toString(),
  );
  lines.push("");
  lines.push(`Name: ${submission.name}`);
  lines.push(`Email: ${submission.email}`);
  lines.push(`Company: ${submission.company || "(not provided)"}`);
  lines.push(`Phone: ${submission.phone || "(not provided)"}`);
  lines.push("");
  lines.push("--- Answers ---");

  const q = submission.questionnaire || {};
  try {
    if (Array.isArray(q.applicationTypes)) {
      lines.push(`Application Types: ${q.applicationTypes.join(", ")}`);
    }
    if (q.appDescription) lines.push(`App Description: ${q.appDescription}`);
    if (Array.isArray(q.userTypes))
      lines.push(`User Types: ${q.userTypes.join(", ")}`);
    if (Array.isArray(q.mustHaveFeatures))
      lines.push(`Must-Have Features: ${q.mustHaveFeatures.join(", ")}`);
    if (q.customFeatureDetails)
      lines.push(`Custom Feature Details: ${q.customFeatureDetails}`);
    if (q.referenceApps) lines.push(`Reference Apps: ${q.referenceApps}`);
    if (q.buildType) lines.push(`Build Type: ${q.buildType}`);
    if (q.projectTimeline) lines.push(`Timeline: ${q.projectTimeline}`);
    if (q.budgetRange) lines.push(`Budget: ${q.budgetRange}`);
    if (Array.isArray(q.techPreferences))
      lines.push(`Tech Preferences: ${q.techPreferences.join(", ")}`);
  } catch (err) {
    lines.push("(Error building questionnaire text)");
    lines.push(JSON.stringify(q));
  }

  const attachmentContent = lines.join("\n");

  if (!user || !pass) {
    console.log(
      "SMTP credentials not configured. Questionnaire content:\n",
      attachmentContent,
    );
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const filenameTxt = `custom-app-questionnaire-${Date.now()}.txt`;
    const filenameDoc = filenameTxt.replace(/\.txt$/, ".doc");

    const mailOptions: any = {
      from: FROM_QUESTIONNAIRE(user),
      to: adminEmail,
      subject: `New Custom App Questionnaire from ${submission.name}`,
      text: `New questionnaire submitted by ${submission.name} <${submission.email}>. See attached file for full answers.`,
      attachments: [
        {
          filename: filenameTxt,
          content: attachmentContent,
        },
        {
          filename: filenameDoc,
          content: attachmentContent,
          contentType: "application/msword",
        },
      ],
    };

    if ((submission as any).file && (submission as any).file.path) {
      const f: any = (submission as any).file;
      mailOptions.attachments.push({
        filename: f.originalname || path.basename(f.path),
        path: f.path,
        contentType: f.mimetype || undefined,
      });
    }

    await transporter.sendMail(mailOptions);
    console.log("Questionnaire emailed to", adminEmail);
    return { success: true, method: "smtp" };
  } catch (error) {
    console.error("Failed to send questionnaire email:", error);
    return { success: false, error };
  }
}

// NEW — GENERIC SMTP METHOD (Gmail OR Zoho)
export async function sendEmailViaGmail(submission: {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}) {
  const { host, port, user, pass } = getSmtpConfig();

  if (!user || !pass) {
    console.log(
      "SMTP credentials not configured, falling back to console logging",
    );
    console.log("Submission:", submission);
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: FROM_NEWSLETTER(user),
      to: submission.email,
      subject: "Newsletter Subscription Confirmation",
      html: `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Subscription Confirmation</title>
       </head>
       <body style="margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; 
         background: linear-gradient(to right, #CF4163, #552265); color:#fff;">
         <table width="100%" cellspacing="0" cellpadding="0">
           <tr>
             <td align="center" style="padding: 40px 0;">
               <table width="600" cellpadding="20" cellspacing="0" 
                 style="background: rgba(255,255,255,0.1); border-radius:12px; 
                 box-shadow:0 4px 12px rgba(0,0,0,0.2); backdrop-filter: blur(6px);">
                 <tr>
                   <td align="center" style="text-align:center;">
                     <h1 style="color:#fff; margin-bottom:8px; font-size:24px;">
                       Welcome to Our Newsletter 🎉
                     </h1>
                     <p style="color:#f3f3f3; font-size:16px; margin:0;">
                       Hello <b>${submission.name}</b>, thanks for subscribing!
                     </p>
                     <p style="color:#ddd; font-size:14px; margin:16px 0;">
                       You'll now receive short, practical tips and tools to grow your agency – 
                       all in a quick 1-minute read.
                     </p>
                     <table cellpadding="8" cellspacing="0" width="100%" 
                       style="margin:20px 0; text-align:left; font-size:14px; color:#fff;">
                       <tr><td>✅ Fast client-winning strategies</td></tr>
                       <tr><td>✅ Pricing & proposal hacks</td></tr>
                       <tr><td>✅ AI & automation tips</td></tr>
                       <tr><td>✅ Real stories from agencies like yours</td></tr>
                     </table>
                     <a href="#" 
                       style="display:inline-block; background:#fff; color:#552265; 
                       text-decoration:none; padding:12px 24px; border-radius:8px; 
                       font-weight:bold; margin-top:16px;">
                       Explore Resources
                     </a>
                     <p style="margin-top:24px; font-size:12px; color:#ccc;">
                       Subscribed at: ${submission.submittedAt.toLocaleString()}
                     </p>
                   </td>
                 </tr>
               </table>
             </td>
           </tr>
         </table>
       </body>
       </html>
       `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent via SMTP to", submission.email);
    return {
      success: true,
      method: host.includes("gmail") ? "gmail_smtp" : "zoho_smtp",
    };
  } catch (error) {
    console.error("SMTP send failed:", error);
    return { success: false, method: "failed" };
  }
}

export async function sendAppointmentNotification(
  appt: AppointmentNotificationPayload,
) {
  try {
    notificationService.addNotification("appointment_booked", {
      id: appt.id,
      name: appt.name,
      email: appt.email,
      phone: appt.phone,
      serviceType: appt.serviceType,
      notes: appt.notes,
      date: appt.date,
      startTime: appt.startTime,
      endTime: appt.endTime,
      meetingLink: appt.meetingLink,
      guestEmails: appt.guestEmails,
      createdAt: appt.createdAt || new Date(),

      // ✅ NEW
      bookedFromTimeZone: appt.bookedFromTimeZone,
      bookedFromTimeZoneLabel: appt.bookedFromTimeZoneLabel,
    });
  } catch (err) {
    console.error("Failed to add in-memory appointment notification:", err);
  }

  const { host, port, user, pass } = getSmtpConfig();

  // const adminEmail = "raje@brandingbeez.co.uk";
  const adminEmail = "pradeep.brandingbeez@gmail.com";

  if (!user || !pass) {
    console.log("SMTP not configured. Appointment notification:");
    console.log(appt);
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    // ✅ ADMIN gets HOST time (IST) always
    const prettyDateHost = formatDateLabel(appt.date, HOST_TZ);
    const prettyTimeHost = formatTimeRangeInTimeZone(
      appt.date,
      appt.startTime,
      appt.endTime,
      HOST_TZ,
    );

      const attendeeTZ = safeTimeZone(appt.bookedFromTimeZone) || HOST_TZ;
  const attendeeTZLabel =
    appt.bookedFromTimeZoneLabel || attendeeTZ || "Selected timezone";


  const prettyTimeAttendee = formatTimeRangeInTimeZone(
    appt.date,
    appt.startTime,
    appt.endTime,
    attendeeTZ,
  );

    const mailOptions = {
      from: FROM_APPOINTMENTS(user),
      to: adminEmail,
      subject: `New appointment booked – ${prettyDateHost} @ ${prettyTimeHost} (IST)`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <body style="font-family: Arial, sans-serif; background:#0b1020; color:#f5f5f5; padding:24px;">
        <div style="max-width:600px;margin:0 auto;background:#141827;border-radius:12px;padding:20px;border:1px solid #272b3b;">
          <h2 style="margin-top:0;color:#ff6b81;">New Appointment Booked</h2>
          <p>You have a new appointment booked via the BrandingBeez website.</p>

          <h3 style="margin-bottom:8px;color:#ffffff;">Slot Details (Host Time)</h3>
          <ul style="list-style:none;padding-left:0;font-size:14px;">
            <li><b>Date:</b> ${prettyDateHost}</li>
            <li><b>Time:</b> ${prettyTimeHost} <span style="color:#9ca3af;">(IST)</span></li>
          </ul>

          ${
            appt.bookedFromTimeZoneLabel || appt.bookedFromTimeZone
              ? `
              <h3 style="margin-bottom:8px;color:#ffffff;">Customer Selected Timezone</h3>
              <p style="font-size:14px;color:#e5e7eb;">
                ${appt.bookedFromTimeZoneLabel || "(label not set)"}
                ${
                  appt.bookedFromTimeZone
                    ? `<br/><span style="font-size:12px;color:#9ca3af;">${appt.bookedFromTimeZone}</span>`
                    : ""
                }
                        <li><b>Time:</b> ${prettyTimeAttendee} <span style="color:#6b7280;">(${attendeeTZLabel})</span></li>

              </p>
              `
              : ""
          }

          ${
            appt.meetingLink
              ? `
          <h3 style="margin-bottom:8px;color:#ffffff;">Google Meet</h3>
          <p style="font-size:14px;">
            <a href="${appt.meetingLink}" style="color:#60a5fa;text-decoration:none;font-weight:bold;">
              Join Meeting
            </a><br/>
            <span style="font-size:12px;color:#9ca3af;">${appt.meetingLink}</span>
          </p>
          `
              : ""
          }

          <h3 style="margin-bottom:8px;color:#ffffff;">Contact Details</h3>
          <ul style="list-style:none;padding-left:0;font-size:14px;">
            <li><b>Name:</b> ${appt.name}</li>
            <li><b>Email:</b> ${appt.email}</li>
            <li><b>Phone:</b> ${appt.phone || "(not provided)"}</li>
            <li><b>Service / Topic:</b> ${appt.serviceType || "(not specified)"}</li>
          </ul>

          ${
            appt.guestEmails && appt.guestEmails.length
              ? `<h3 style="margin-bottom:8px;color:#ffffff;">Guests</h3>
                 <p style="font-size:14px;">${appt.guestEmails.join(", ")}</p>`
              : ""
          }

          ${
            appt.notes
              ? `<h3 style="margin-bottom:8px;color:#ffffff;">Notes</h3>
                 <p style="font-size:14px;white-space:pre-wrap;">${appt.notes}</p>`
              : ""
          }

          <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
            Appointment ID: ${appt.id}<br/>
            Created at: ${(appt.createdAt || new Date()).toLocaleString()}
          </p>
        </div>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Appointment notification emailed to", adminEmail);
    return { success: true, method: "smtp" };
  } catch (error) {
    console.error("❌ Failed to send appointment email:", error);
    return { success: false, error };
  }
}

// ✅ Send confirmation to main attendee (SHOW USER-SELECTED TIMEZONE)
export async function sendAppointmentConfirmationToAttendee(
  appt: AppointmentNotificationPayload,
) {
  const { host, port, user, pass } = getSmtpConfig();

  if (!user || !pass) {
    console.log(
      "SMTP not configured. Attendee confirmation email payload:",
      appt,
    );
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });

  // ✅ attendee timezone (what they selected). fallback = their browser timezone unknown here -> use host tz.
  const attendeeTZ = safeTimeZone(appt.bookedFromTimeZone) || HOST_TZ;
  const attendeeTZLabel =
    appt.bookedFromTimeZoneLabel || attendeeTZ || "Selected timezone";

  const prettyDateAttendee = formatDateLabel(appt.date, attendeeTZ);
  const prettyTimeAttendee = formatTimeRangeInTimeZone(
    appt.date,
    appt.startTime,
    appt.endTime,
    attendeeTZ,
  );

  const subject = `Your BrandingBeez call is confirmed – ${prettyDateAttendee} @ ${prettyTimeAttendee}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e5e7eb;">
      <h2 style="margin-top:0;color:#1f2933;">Your strategy call is confirmed 🎉</h2>
      <p style="font-size:14px;color:#374151;">
        Hi <b>${appt.name}</b>,
      </p>
      <p style="font-size:14px;color:#374151;">
        Thanks for booking a call with <b>BrandingBeez</b>. Here are your appointment details:
      </p>

      <h3 style="margin-bottom:8px;color:#111827;">Call details</h3>
      <ul style="list-style:none;padding-left:0;font-size:14px;color:#374151;">
        <li><b>Date:</b> ${prettyDateAttendee}</li>
        <li><b>Time:</b> ${prettyTimeAttendee} <span style="color:#6b7280;">(${attendeeTZLabel})</span></li>
        <li><b>Topic:</b> ${appt.serviceType || "Strategy / consultation call"}</li>
      </ul>

      ${
        appt.meetingLink
          ? `
      <p style="margin-top:16px;font-size:14px;">
        <b>Join via Google Meet:</b><br/>
        <a href="${appt.meetingLink}" style="color:#2563eb;text-decoration:none;font-weight:bold;">
          Join Meeting
        </a><br/>
        <span style="font-size:12px;color:#6b7280;">${appt.meetingLink}</span>
      </p>
      `
          : ""
      }

      ${
        appt.guestEmails && appt.guestEmails.length
          ? `
      <p style="margin-top:12px;font-size:13px;color:#4b5563;">
        We've also invited your guests: ${appt.guestEmails.join(", ")}.
      </p>`
          : ""
      }

      ${
        appt.notes
          ? `
      <h3 style="margin-bottom:8px;color:#111827;">Your notes</h3>
      <p style="font-size:14px;color:#374151;white-space:pre-wrap;">
        ${appt.notes}
      </p>`
          : ""
      }

      <p style="margin-top:18px;font-size:12px;color:#9ca3af;">
        Your calendar invite will automatically adjust if you travel or change timezone.
      </p>

      <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
        Appointment ID: ${appt.id}<br/>
        Created at: ${(appt.createdAt || new Date()).toLocaleString()}
      </p>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: FROM_APPOINTMENTS(user),
    to: appt.email,
    subject,
    html,
  });

  console.log("✅ Attendee confirmation sent to", appt.email);
  return { success: true, method: "smtp" };
}

// ✅ Send confirmation to each guest (SHOW USER-SELECTED TIMEZONE)
export async function sendAppointmentConfirmationToGuests(
  appt: AppointmentNotificationPayload,
) {
  const guestEmails = (appt.guestEmails || []).filter(Boolean);
  if (!guestEmails.length) {
    return { success: true, method: "no_guests" };
  }

  const { host, port, user, pass } = getSmtpConfig();
  if (!user || !pass) {
    console.log(
      "SMTP not configured. Guest confirmation payload:",
      appt.guestEmails,
    );
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });

  const attendeeTZ = safeTimeZone(appt.bookedFromTimeZone) || HOST_TZ;
  const attendeeTZLabel =
    appt.bookedFromTimeZoneLabel || attendeeTZ || "Selected timezone";

  const prettyDateAttendee = formatDateLabel(appt.date, attendeeTZ);
  const prettyTimeAttendee = formatTimeRangeInTimeZone(
    appt.date,
    appt.startTime,
    appt.endTime,
    attendeeTZ,
  );

  const subject = `You've been added as a guest – ${prettyDateAttendee} @ ${prettyTimeAttendee}`;

  const html = (guestEmail: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e5e7eb;">
      <h2 style="margin-top:0;color:#1f2933;">You've been invited to a call</h2>
      <p style="font-size:14px;color:#374151;">
        Hi,
      </p>
      <p style="font-size:14px;color:#374151;">
        <b>${appt.name}</b> has added you as a guest to a strategy call booked with <b>BrandingBeez</b>.
      </p>

      <h3 style="margin-bottom:8px;color:#111827;">Call details</h3>
      <ul style="list-style:none;padding-left:0;font-size:14px;color:#374151;">
        <li><b>Date:</b> ${prettyDateAttendee}</li>
        <li><b>Time:</b> ${prettyTimeAttendee} <span style="color:#6b7280;">(${attendeeTZLabel})</span></li>
        <li><b>Main attendee:</b> ${appt.name} &lt;${appt.email}&gt;</li>
        <li><b>Topic:</b> ${appt.serviceType || "Strategy / consultation call"}</li>
      </ul>

      ${
        appt.meetingLink
          ? `
      <p style="margin-top:16px;font-size:14px;">
        <b>Join via Google Meet:</b><br/>
        <a href="${appt.meetingLink}" style="color:#2563eb;text-decoration:none;font-weight:bold;">
          Join Meeting
        </a><br/>
        <span style="font-size:12px;color:#6b7280;">${appt.meetingLink}</span>
      </p>
      `
          : ""
      }

      <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
        Appointment ID: ${appt.id}<br/>
        Invited email: ${guestEmail}
      </p>
    </div>
  </body>
  </html>
  `;

  for (const guestEmail of guestEmails) {
    await transporter.sendMail({
      from: FROM_APPOINTMENTS(user),
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







//---------------------------------------------------------------------------------------- //
// import path from "path";
// import nodemailer from "nodemailer";
// import { notificationService } from "./notification-service";

// interface AppointmentNotificationPayload {
//   id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   serviceType?: string;
//   notes?: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   createdAt?: Date;
//   meetingLink?: string;
//   guestEmails?: string[];
// }

// interface ContactSubmission {
//   name: string;
//   email: string;
//   company?: string;
//   phone?: string;
//   message: string;
//   submittedAt: Date;
// }

// // 🔐 Global SMTP envs
// const SMTP_USER = process.env.SMTP_USER || "";
// const SMTP_PASS = process.env.SMTP_PASSWORD || "";

// function getSmtpConfig() {
//   let host = process.env.SMTP_HOST || "";
//   let port = process.env.SMTP_PORT || "";

//   if (!host) {
//     if (SMTP_USER.toLowerCase().endsWith("@gmail.com")) {
//       host = "smtp.gmail.com";
//     } else {
//       host = "smtppro.zoho.in";
//     }
//   }

//   if (!port) {
//     port = "465";
//   }

//   return {
//     host,
//     port: Number(port),
//     user: SMTP_USER || undefined,
//     pass: SMTP_PASS || undefined,
//   };
// }

// // Simple email notification using nodemailer (works with Gmail, Outlook, etc.)
// export async function sendContactNotification(submission: ContactSubmission) {
//   notificationService.addNotification("contact_form", {
//     name: submission.name,
//     email: submission.email,
//     company: submission.company,
//     phone: submission.phone,
//     message: submission.message,
//     submittedAt: submission.submittedAt,
//   });

//   console.log("\n🔥 NEW CONTACT FORM SUBMISSION 🔥");
//   console.log(
//     "Time:",
//     new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }),
//   );
//   console.log("Name:", submission.name);
//   console.log("Email:", submission.email);
//   console.log("Company:", submission.company || "Not provided");
//   console.log("Phone:", submission.phone || "Not provided");
//   console.log("Message:", submission.message);
//   console.log("=====================================\n");

//   try {
//     await notificationService.sendWebhook(
//       `New contact form submission from ${submission.name} (${submission.email})`,
//       submission,
//     );
//   } catch (error) {
//     console.error("Webhook notification failed:", error);
//   }

//   return { success: true, method: "console_log_and_memory" };
// }

// // Send a full questionnaire to the admin email as a text attachment
// export async function sendQuestionnaireToAdmin(submission: {
//   name: string;
//   email: string;
//   company?: string;
//   phone?: string;
//   questionnaire: any;
//   submittedAt?: Date;
//   file?: { path: string; originalname?: string; mimetype?: string };
// }) {
//   notificationService.addNotification("custom_app_questionnaire", {
//     name: submission.name,
//     email: submission.email,
//     company: submission.company,
//     phone: submission.phone,
//     questionnaire: submission.questionnaire,
//     submittedAt: submission.submittedAt || new Date(),
//   });

//   const { host, port, user, pass } = getSmtpConfig();

//   const adminEmail = "info@brandingbeez.co.uk";

//   const lines: string[] = [];
//   lines.push("Custom App Questionnaire Submission");
//   lines.push(
//     "Submitted At: " + (submission.submittedAt || new Date()).toString(),
//   );
//   lines.push("");
//   lines.push(`Name: ${submission.name}`);
//   lines.push(`Email: ${submission.email}`);
//   lines.push(`Company: ${submission.company || "(not provided)"}`);
//   lines.push(`Phone: ${submission.phone || "(not provided)"}`);
//   lines.push("");
//   lines.push("--- Answers ---");

//   const q = submission.questionnaire || {};
//   try {
//     if (Array.isArray(q.applicationTypes)) {
//       lines.push(`Application Types: ${q.applicationTypes.join(", ")}`);
//     }
//     if (q.appDescription) lines.push(`App Description: ${q.appDescription}`);
//     if (Array.isArray(q.userTypes))
//       lines.push(`User Types: ${q.userTypes.join(", ")}`);
//     if (Array.isArray(q.mustHaveFeatures))
//       lines.push(`Must-Have Features: ${q.mustHaveFeatures.join(", ")}`);
//     if (q.customFeatureDetails)
//       lines.push(`Custom Feature Details: ${q.customFeatureDetails}`);
//     if (q.referenceApps) lines.push(`Reference Apps: ${q.referenceApps}`);
//     if (q.buildType) lines.push(`Build Type: ${q.buildType}`);
//     if (q.projectTimeline) lines.push(`Timeline: ${q.projectTimeline}`);
//     if (q.budgetRange) lines.push(`Budget: ${q.budgetRange}`);
//     if (Array.isArray(q.techPreferences))
//       lines.push(`Tech Preferences: ${q.techPreferences.join(", ")}`);
//   } catch (err) {
//     lines.push("(Error building questionnaire text)");
//     lines.push(JSON.stringify(q));
//   }

//   const attachmentContent = lines.join("\n");

//   if (!user || !pass) {
//     console.log(
//       "SMTP credentials not configured. Questionnaire content:\n",
//       attachmentContent,
//     );
//     return { success: true, method: "console_log" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       host,
//       port,
//       secure: true,
//       auth: {
//         user,
//         pass,
//       },
//     });

//     const filenameTxt = `custom-app-questionnaire-${Date.now()}.txt`;
//     const filenameDoc = filenameTxt.replace(/\.txt$/, ".doc");

//     const mailOptions: any = {
//       from: user,
//       to: adminEmail,
//       subject: `New Custom App Questionnaire from ${submission.name}`,
//       text: `New questionnaire submitted by ${submission.name} <${submission.email}>. See attached file for full answers.`,
//       attachments: [
//         {
//           filename: filenameTxt,
//           content: attachmentContent,
//         },
//         {
//           filename: filenameDoc,
//           content: attachmentContent,
//           contentType: "application/msword",
//         },
//       ],
//     };

//     if ((submission as any).file && (submission as any).file.path) {
//       const f: any = (submission as any).file;
//       mailOptions.attachments.push({
//         filename: f.originalname || path.basename(f.path),
//         path: f.path,
//         contentType: f.mimetype || undefined,
//       });
//     }

//     await transporter.sendMail(mailOptions);
//     console.log("Questionnaire emailed to", adminEmail);
//     return { success: true, method: "smtp" };
//   } catch (error) {
//     console.error("Failed to send questionnaire email:", error);
//     return { success: false, error };
//   }
// }

// // NEW — GENERIC SMTP METHOD (Gmail OR Zoho)
// export async function sendEmailViaGmail(submission: {
//   name: string;
//   email: string;
//   message: string;
//   submittedAt: Date;
// }) {
//   const { host, port, user, pass } = getSmtpConfig();

//   if (!user || !pass) {
//     console.log(
//       "SMTP credentials not configured, falling back to console logging",
//     );
//     console.log("Submission:", submission);
//     return { success: true, method: "console_log" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       host,
//       port,
//       secure: true,
//       auth: {
//         user,
//         pass,
//       },
//     });

//     const mailOptions = {
//       from: user,
//       to: submission.email,
//       subject: "Newsletter Subscription Confirmation",
//       html: `
//        <!DOCTYPE html>
//        <html lang="en">
//        <head>
//          <meta charset="UTF-8" />
//          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//          <title>Subscription Confirmation</title>
//        </head>
//        <body style="margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; 
//          background: linear-gradient(to right, #CF4163, #552265); color:#fff;">
//          <table width="100%" cellspacing="0" cellpadding="0">
//            <tr>
//              <td align="center" style="padding: 40px 0;">
//                <table width="600" cellpadding="20" cellspacing="0" 
//                  style="background: rgba(255,255,255,0.1); border-radius:12px; 
//                  box-shadow:0 4px 12px rgba(0,0,0,0.2); backdrop-filter: blur(6px);">
//                  <tr>
//                    <td align="center" style="text-align:center;">
//                      <h1 style="color:#fff; margin-bottom:8px; font-size:24px;">
//                        Welcome to Our Newsletter 🎉
//                      </h1>
//                      <p style="color:#f3f3f3; font-size:16px; margin:0;">
//                        Hello <b>${submission.name}</b>, thanks for subscribing!
//                      </p>
//                      <p style="color:#ddd; font-size:14px; margin:16px 0;">
//                        You'll now receive short, practical tips and tools to grow your agency – 
//                        all in a quick 1-minute read.
//                      </p>
//                      <table cellpadding="8" cellspacing="0" width="100%" 
//                        style="margin:20px 0; text-align:left; font-size:14px; color:#fff;">
//                        <tr><td>✅ Fast client-winning strategies</td></tr>
//                        <tr><td>✅ Pricing & proposal hacks</td></tr>
//                        <tr><td>✅ AI & automation tips</td></tr>
//                        <tr><td>✅ Real stories from agencies like yours</td></tr>
//                      </table>
//                      <a href="#" 
//                        style="display:inline-block; background:#fff; color:#552265; 
//                        text-decoration:none; padding:12px 24px; border-radius:8px; 
//                        font-weight:bold; margin-top:16px;">
//                        Explore Resources
//                      </a>
//                      <p style="margin-top:24px; font-size:12px; color:#ccc;">
//                        Subscribed at: ${submission.submittedAt.toLocaleString()}
//                      </p>
//                    </td>
//                  </tr>
//                </table>
//              </td>
//            </tr>
//          </table>
//        </body>
//        </html>
//        `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent via SMTP to", submission.email);
//     return {
//       success: true,
//       method: host.includes("gmail") ? "gmail_smtp" : "zoho_smtp",
//     };
//   } catch (error) {
//     console.error("SMTP send failed:", error);
//     return { success: false, method: "failed" };
//   }
// }

// // export async function sendAppointmentNotification(
// //   appt: AppointmentNotificationPayload,
// // ) {
// //   try {
// //     notificationService.addNotification("appointment_booked", {
// //       id: appt.id,
// //       name: appt.name,
// //       email: appt.email,
// //       phone: appt.phone,
// //       serviceType: appt.serviceType,
// //       notes: appt.notes,
// //       date: appt.date,
// //       startTime: appt.startTime,
// //       endTime: appt.endTime,
// //       meetingLink: appt.meetingLink, 
// //       createdAt: appt.createdAt || new Date(),
// //     });
// //   } catch (err) {
// //     console.error("Failed to add in-memory appointment notification:", err);
// //   }

// //   const { host, port, user, pass } = getSmtpConfig();

// //   const adminEmail = "raje@brandingbeez.co.uk";
// //   // const adminEmail = "pradeep.brandingbeez@gmail.com";

// //   if (!user || !pass) {
// //     console.log("SMTP not configured. Appointment notification:");
// //     console.log(appt);
// //     return { success: true, method: "console_log" };
// //   }

// //   try {
// //     const transporter = nodemailer.createTransport({
// //       host,
// //       port,
// //       secure: true,
// //       auth: {
// //         user,
// //         pass,
// //       },
// //     });

// //     const prettyDate = appt.date;
// //     const prettyTime = `${appt.startTime} – ${appt.endTime}`;

// //     const mailOptions = {
// //       from: user,
// //       to: adminEmail,
// //       subject: `New appointment booked – ${prettyDate} @ ${prettyTime}`,
// //       html: `
// //       <!DOCTYPE html>
// //       <html lang="en">
// //       <body style="font-family: Arial, sans-serif; background:#0b1020; color:#f5f5f5; padding:24px;">
// //         <div style="max-width:600px;margin:0 auto;background:#141827;border-radius:12px;padding:20px;border:1px solid #272b3b;">
// //           <h2 style="margin-top:0;color:#ff6b81;">New Appointment Booked</h2>
// //           <p>You have a new appointment booked via the BrandingBeez website.</p>

// //           <h3 style="margin-bottom:8px;color:#ffffff;">Slot Details</h3>
// //           <ul style="list-style:none;padding-left:0;font-size:14px;">
// //             <li><b>Date:</b> ${prettyDate}</li>
// //             <li><b>Time:</b> ${prettyTime}</li>
// //           </ul>

// //           ${appt.meetingLink
// //           ? `
// //           <h3 style="margin-bottom:8px;color:#ffffff;">Google Meet</h3>
// //           <p style="font-size:14px;">
// //             <a href="${appt.meetingLink}" style="color:#60a5fa;text-decoration:none;font-weight:bold;">
// //               Join Meeting
// //             </a><br/>
// //             <span style="font-size:12px;color:#9ca3af;">${appt.meetingLink}</span>
// //           </p>
// //           `
// //           : `
// //           <p style="font-size:13px;color:#9ca3af;">
// //           </p>
// //           `
// //         }
         
// //           <h3 style="margin-bottom:8px;color:#ffffff;">Contact Details</h3>
// //           <ul style="list-style:none;padding-left:0;font-size:14px;">
// //             <li><b>Name:</b> ${appt.name}</li>
// //             <li><b>Email:</b> ${appt.email}</li>
// //             <li><b>Phone:</b> ${appt.phone || "(not provided)"}</li>
// //             <li><b>Service / Topic:</b> ${appt.serviceType || "(not specified)"}</li>
// //           </ul>

// //           ${appt.notes
// //           ? `<h3 style="margin-bottom:8px;color:#ffffff;">Notes</h3>
// //                  <p style="font-size:14px;white-space:pre-wrap;">${appt.notes}</p>`
// //           : ""
// //         }

// //           <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
// //             Appointment ID: ${appt.id}<br/>
// //             Created at: ${(appt.createdAt || new Date()).toLocaleString()}
// //           </p>
// //         </div>
// //       </body>
// //       </html>
// //     `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log("✅ Appointment notification emailed to", adminEmail);
// //     return { success: true, method: "smtp" };
// //   } catch (error) {
// //     console.error("❌ Failed to send appointment email:", error);
// //     return { success: false, error };
// //   }
// // }


// export async function sendAppointmentNotification(
//   appt: AppointmentNotificationPayload,
// ) {
//   try {
//     notificationService.addNotification("appointment_booked", {
//       id: appt.id,
//       name: appt.name,
//       email: appt.email,
//       phone: appt.phone,
//       serviceType: appt.serviceType,
//       notes: appt.notes,
//       date: appt.date,
//       startTime: appt.startTime,
//       endTime: appt.endTime,
//       meetingLink: appt.meetingLink,
//       guestEmails: appt.guestEmails,
//       createdAt: appt.createdAt || new Date(),
//     });
//   } catch (err) {
//     console.error("Failed to add in-memory appointment notification:", err);
//   }

//   const { host, port, user, pass } = getSmtpConfig();

//   // const adminEmail = "raje@brandingbeez.co.uk";
//   const adminEmail = "pradeep.brandingbeez@gmail.com";

//   if (!user || !pass) {
//     console.log("SMTP not configured. Appointment notification:");
//     console.log(appt);
//     return { success: true, method: "console_log" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       host,
//       port,
//       secure: true,
//       auth: {
//         user,
//         pass,
//       },
//     });

//     const prettyDate = appt.date;
//     const prettyTime = `${appt.startTime} – ${appt.endTime}`;

//     const mailOptions = {
//       from: user,
//       to: adminEmail,
//       subject: `New appointment booked – ${prettyDate} @ ${prettyTime}`,
//       html: `
//       <!DOCTYPE html>
//       <html lang="en">
//       <body style="font-family: Arial, sans-serif; background:#0b1020; color:#f5f5f5; padding:24px;">
//         <div style="max-width:600px;margin:0 auto;background:#141827;border-radius:12px;padding:20px;border:1px solid #272b3b;">
//           <h2 style="margin-top:0;color:#ff6b81;">New Appointment Booked</h2>
//           <p>You have a new appointment booked via the BrandingBeez website.</p>

//           <h3 style="margin-bottom:8px;color:#ffffff;">Slot Details</h3>
//           <ul style="list-style:none;padding-left:0;font-size:14px;">
//             <li><b>Date:</b> ${prettyDate}</li>
//             <li><b>Time:</b> ${prettyTime}</li>
//           </ul>

//           ${
//             appt.meetingLink
//               ? `
//           <h3 style="margin-bottom:8px;color:#ffffff;">Google Meet</h3>
//           <p style="font-size:14px;">
//             <a href="${appt.meetingLink}" style="color:#60a5fa;text-decoration:none;font-weight:bold;">
//               Join Meeting
//             </a><br/>
//             <span style="font-size:12px;color:#9ca3af;">${appt.meetingLink}</span>
//           </p>
//           `
//               : ""
//           }

//           <h3 style="margin-bottom:8px;color:#ffffff;">Contact Details</h3>
//           <ul style="list-style:none;padding-left:0;font-size:14px;">
//             <li><b>Name:</b> ${appt.name}</li>
//             <li><b>Email:</b> ${appt.email}</li>
//             <li><b>Phone:</b> ${appt.phone || "(not provided)"}</li>
//             <li><b>Service / Topic:</b> ${appt.serviceType || "(not specified)"}</li>
//           </ul>

//           ${
//             appt.guestEmails && appt.guestEmails.length
//               ? `<h3 style="margin-bottom:8px;color:#ffffff;">Guests</h3>
//                  <p style="font-size:14px;">${appt.guestEmails.join(", ")}</p>`
//               : ""
//           }

//           ${
//             appt.notes
//               ? `<h3 style="margin-bottom:8px;color:#ffffff;">Notes</h3>
//                  <p style="font-size:14px;white-space:pre-wrap;">${appt.notes}</p>`
//               : ""
//           }

//           <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
//             Appointment ID: ${appt.id}<br/>
//             Created at: ${(appt.createdAt || new Date()).toLocaleString()}
//           </p>
//         </div>
//       </body>
//       </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Appointment notification emailed to", adminEmail);
//     return { success: true, method: "smtp" };
//   } catch (error) {
//     console.error("❌ Failed to send appointment email:", error);
//     return { success: false, error };
//   }
// }

// // ✅ Send confirmation to main attendee
// export async function sendAppointmentConfirmationToAttendee(
//   appt: AppointmentNotificationPayload,
// ) {
//   const { host, port, user, pass } = getSmtpConfig();

//   if (!user || !pass) {
//     console.log(
//       "SMTP not configured. Attendee confirmation email payload:",
//       appt,
//     );
//     return { success: true, method: "console_log" };
//   }

//   const transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure: true,
//     auth: { user, pass },
//   });

//   const prettyDate = appt.date;
//   const prettyTime = `${appt.startTime} – ${appt.endTime}`;
//   const subject = `Your BrandingBeez call is confirmed – ${prettyDate} @ ${prettyTime}`;

//   const html = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:24px;">
//     <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e5e7eb;">
//       <h2 style="margin-top:0;color:#1f2933;">Your strategy call is confirmed 🎉</h2>
//       <p style="font-size:14px;color:#374151;">
//         Hi <b>${appt.name}</b>,
//       </p>
//       <p style="font-size:14px;color:#374151;">
//         Thanks for booking a call with <b>BrandingBeez</b>. Here are your appointment details:
//       </p>

//       <h3 style="margin-bottom:8px;color:#111827;">Call details</h3>
//       <ul style="list-style:none;padding-left:0;font-size:14px;color:#374151;">
//         <li><b>Date:</b> ${prettyDate}</li>
//         <li><b>Time:</b> ${prettyTime} (IST base, converted in your calendar)</li>
//         <li><b>Topic:</b> ${appt.serviceType || "Strategy / consultation call"}</li>
//       </ul>

//       ${
//         appt.meetingLink
//           ? `
//       <p style="margin-top:16px;font-size:14px;">
//         <b>Join via Google Meet:</b><br/>
//         <a href="${appt.meetingLink}" style="color:#2563eb;text-decoration:none;font-weight:bold;">
//           Join Meeting
//         </a><br/>
//         <span style="font-size:12px;color:#6b7280;">${appt.meetingLink}</span>
//       </p>
//       `
//           : ""
//       }

//       ${
//         appt.guestEmails && appt.guestEmails.length
//           ? `
//       <p style="margin-top:12px;font-size:13px;color:#4b5563;">
//         We've also invited your guests: ${appt.guestEmails.join(", ")}.
//       </p>`
//           : ""
//       }

//       ${
//         appt.notes
//           ? `
//       <h3 style="margin-bottom:8px;color:#111827;">Your notes</h3>
//       <p style="font-size:14px;color:#374151;white-space:pre-wrap;">
//         ${appt.notes}
//       </p>`
//           : ""
//       }

//       <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
//         Appointment ID: ${appt.id}<br/>
//         Created at: ${(appt.createdAt || new Date()).toLocaleString()}
//       </p>
//     </div>
//   </body>
//   </html>
//   `;

//   await transporter.sendMail({
//     from: user,
//     to: appt.email,
//     subject,
//     html,
//   });

//   console.log("✅ Attendee confirmation sent to", appt.email);
//   return { success: true, method: "smtp" };
// }

// // ✅ Send confirmation to each guest
// export async function sendAppointmentConfirmationToGuests(
//   appt: AppointmentNotificationPayload,
// ) {
//   const guestEmails = (appt.guestEmails || []).filter(Boolean);
//   if (!guestEmails.length) {
//     return { success: true, method: "no_guests" };
//   }

//   const { host, port, user, pass } = getSmtpConfig();
//   if (!user || !pass) {
//     console.log(
//       "SMTP not configured. Guest confirmation payload:",
//       appt.guestEmails,
//     );
//     return { success: true, method: "console_log" };
//   }

//   const transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure: true,
//     auth: { user, pass },
//   });

//   const prettyDate = appt.date;
//   const prettyTime = `${appt.startTime} – ${appt.endTime}`;
//   const subject = `You've been added as a guest – ${prettyDate} @ ${prettyTime}`;

//   const html = (guestEmail: string) => `
//   <!DOCTYPE html>
//   <html lang="en">
//   <body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:24px;">
//     <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e5e7eb;">
//       <h2 style="margin-top:0;color:#1f2933;">You've been invited to a call</h2>
//       <p style="font-size:14px;color:#374151;">
//         Hi,
//       </p>
//       <p style="font-size:14px;color:#374151;">
//         <b>${appt.name}</b> has added you as a guest to a strategy call booked with <b>BrandingBeez</b>.
//       </p>

//       <h3 style="margin-bottom:8px;color:#111827;">Call details</h3>
//       <ul style="list-style:none;padding-left:0;font-size:14px;color:#374151;">
//         <li><b>Date:</b> ${prettyDate}</li>
//         <li><b>Time:</b> ${prettyTime} (IST base, converted in your calendar)</li>
//         <li><b>Main attendee:</b> ${appt.name} &lt;${appt.email}&gt;</li>
//         <li><b>Topic:</b> ${appt.serviceType || "Strategy / consultation call"}</li>
//       </ul>

//       ${
//         appt.meetingLink
//           ? `
//       <p style="margin-top:16px;font-size:14px;">
//         <b>Join via Google Meet:</b><br/>
//         <a href="${appt.meetingLink}" style="color:#2563eb;text-decoration:none;font-weight:bold;">
//           Join Meeting
//         </a><br/>
//         <span style="font-size:12px;color:#6b7280;">${appt.meetingLink}</span>
//       </p>
//       `
//           : ""
//       }

//       <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
//         Appointment ID: ${appt.id}<br/>
//         Invited email: ${guestEmail}
//       </p>
//     </div>
//   </body>
//   </html>
//   `;

//   // send to each guest (no need for await-all concurrency here)
//   for (const guestEmail of guestEmails) {
//     await transporter.sendMail({
//       from: user,
//       to: guestEmail,
//       subject,
//       html: html(guestEmail),
//     });
//     console.log("✅ Guest confirmation sent to", guestEmail);
//   }

//   return { success: true, method: "smtp" };
// }

// // ✅ Wrapper if you want one call from router
// export async function sendAppointmentConfirmationEmails(
//   appt: AppointmentNotificationPayload,
// ) {
//   await sendAppointmentConfirmationToAttendee(appt);
//   await sendAppointmentConfirmationToGuests(appt);
// }

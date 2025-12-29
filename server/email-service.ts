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

// ✅ Branded "From" helpers (this fixes the sender showing as just "info")
const FROM_APPOINTMENTS = (email?: string) =>
  `"BrandingBeez – Appointments" <${email || "info@brandingbeez.co.uk"}>`;

const FROM_NEWSLETTER = (email?: string) =>
  `"BrandingBeez Newsletter" <${email || "info@brandingbeez.co.uk"}>`;

const FROM_QUESTIONNAIRE = (email?: string) =>
  `"BrandingBeez – Custom Apps" <${email || "info@brandingbeez.co.uk"}>`;

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
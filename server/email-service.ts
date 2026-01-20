import path from "path";
import fs from "fs";
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

// ✅ NEW: Auto-reply sender
const FROM_CONTACT_AUTOREPLY = (email?: string) =>
  `"Raje – BrandingBeez" <${email || "info@brandingbeez.co.uk"}>`;


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

export async function sendContactAutoReplyEmail(payload: {
  name: string;
  email: string;
  service?: string;
  challenge?: string;
}) {
  const { host, port, user, pass } = getSmtpConfig();

  if (!user || !pass) {
    console.log("SMTP credentials not configured. Auto-reply payload:\n", payload);
    return { success: true, method: "console_log" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });

  const firstName = ((payload.name || "").trim().split(/\s+/)[0] || "there").trim();
  const serviceText = (payload.service || "").trim() || "our services";

  const rawChallenge = (payload.challenge || "").trim();
  const cleanChallenge =
    rawChallenge && rawChallenge.length <= 140
      ? rawChallenge.replace(/\s+/g, " ")
      : "Scaling your operations while keeping quality high";

  const subject = `${firstName} - I think we can nail this 👊 (here's why)`;

  const signaturePath1 = path.resolve(process.cwd(), "server", "assets", "email-signature.png");
  const signaturePath2 = path.resolve(process.cwd(), "server", "assests", "email-signature.png");

  const signaturePath = fs.existsSync(signaturePath1) ? signaturePath1 : signaturePath2;
  const hasSignature = fs.existsSync(signaturePath);

  const attachments: any[] = [];
  if (hasSignature) {
    attachments.push({
      filename: "bb-signature.png",
      path: signaturePath,
      cid: "bb_signature",
      contentDisposition: "inline",
      headers: {
        "Content-ID": "<bb_signature>",
      },
    });
  } else {
    console.warn("⚠️ Signature image NOT FOUND at:", signaturePath);
  }
  // <p style="margin:0;">Best regards,</p>

  const signatureBlock = hasSignature
    ? `
      <div style="margin-top:12px;">
        <img src="cid:bb_signature"
             alt="Raje | BrandingBeez"
             style="display:block; margin-top:8px; max-width:260px; height:auto;" />
      </div>
    `
    : `
      <div style="margin-top:12px; font-size:14px; line-height:1.5;">
        Best regards,<br/>
        <b>Raje</b> | BrandingBeez<br/>
        CEO | BrandingBeez
      </div>
    `;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; color:#111827; background:#ffffff;">
    <div style="max-width:640px; margin:0 auto; padding:20px;">
      <div style="font-size:13px; color:#6b7280; margin-bottom:8px;">BrandingBeez</div>

      <div style="font-size:18px; font-weight:700; margin-bottom:14px;">
        ${firstName} - I think we can nail this 👊 (here's why)
      </div>

      <p style="margin:0 0 12px 0;">Hey ${firstName},</p>
      <p style="margin:0 0 12px 0;">Your inquiry just landed on my desk.</p>

      <p style="margin:0 0 12px 0;">
        I see you’re interested in our <b>${serviceText}</b>, which is amazing!
      </p>

      <p style="margin:0 0 12px 0;">
        <b>${cleanChallenge}</b> - This is something we see quite often with agencies as they grow and scale.
      </p>

      <p style="margin:0 0 12px 0;">
        Rather than assuming anything, it’d be helpful to understand your setup and goals properly.
      </p>

      <p style="margin:0 0 10px 0;">A short 30-minute call will help us:</p>

      <div style="margin:0 0 14px 0; line-height:1.7;">
        • Clarify goals and expectations<br/>
        • Discuss scope, timelines, and budget<br/>
        • Walk through similar projects we’ve delivered
      </div>

      <p style="margin:0 0 12px 0;">
        You can book a time here when it suits you:<br/>
        <a href="https://brandingbeez.co.uk/book-appointment"
           style="color:#2563eb; text-decoration:none; font-weight:700;">
          https://brandingbeez.co.uk/book-appointment
        </a>
      </p>

      <p style="margin:0 0 12px 0;">
        If you have any questions before booking, just reply to this email.
      </p>

      <p style="margin:0 0 18px 0;">Looking forward to connecting.</p>

      ${signatureBlock}

      <div style="margin-top:18px; padding-top:12px; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280;">
        You received this email because you submitted a form on BrandingBeez. If this wasn’t you, just ignore this message.
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: FROM_CONTACT_AUTOREPLY(user),
    to: payload.email,
    subject,
    html,
    attachments,
    replyTo: "info@brandingbeez.co.uk",
    // replyTo: "pradeep.brandingbeez@gmail.com",
  });

  console.log("✅ Contact auto-reply sent to", payload.email);
  return { success: true, method: "smtp" };
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
  subject: "You’re subscribed — here’s what to expect 👋",
  html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; color:#111; line-height:1.6;">
    
    <p>Hi ${submission.name},</p>

    <p>You’re subscribed.</p>

    <p>
      This newsletter exists for one simple reason: 
      to help business owners make better growth decisions.
    </p>

    <p>
      Not motivation.<br/>
      Not random tips.<br/>
      Not noise.
    </p>

    <p>Each week, you’ll get a short read that breaks down:</p>

    <p>
      ~ what’s working across real businesses right now<br/>
      ~ what’s quietly failing and hurting growth<br/>
      ~ what’s changing in the business world and why it matters<br/>
      ~ tools, products, and shifts worth paying attention to<br/>
      ~ what to focus on next as you scale
    </p>

    <p>
      Think of it as a weekly briefing.
    </p>

    <p>
      Something you can read quickly, step back, and think:<br/>
      <em>“Okay, that makes sense.”</em>
    </p>

    <p>You don’t need to do anything right now.</p>

    <p>Your first issue will arrive soon.</p>

    <p>
      Until then, just know this was built for people who care about 
      earning more, scaling cleanly, and avoiding expensive guesswork.
    </p>

    <p>
      Talk soon,<br/>
      <strong>BrandingBeez</strong>
    </p>

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

  const adminEmail = "raje@brandingbeez.co.uk";
  // const adminEmail = "info@brandingbeez.co.uk";
  // const adminEmail = "pradeep.brandingbeez@gmail.com";

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
                <br/>
                <b>Time:</b> ${prettyTimeAttendee} <span style="color:#6b7280;">(${attendeeTZLabel})</span>
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
//       createdAt: appt.createdAt || new Date(),
//     });
//   } catch (err) {
//     console.error("Failed to add in-memory appointment notification:", err);
//   }

//   const { host, port, user, pass } = getSmtpConfig();

//   const adminEmail = "raje@brandingbeez.co.uk";
//   // const adminEmail = "pradeep.brandingbeez@gmail.com";

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

//           ${appt.meetingLink
//           ? `
//           <h3 style="margin-bottom:8px;color:#ffffff;">Google Meet</h3>
//           <p style="font-size:14px;">
//             <a href="${appt.meetingLink}" style="color:#60a5fa;text-decoration:none;font-weight:bold;">
//               Join Meeting
//             </a><br/>
//             <span style="font-size:12px;color:#9ca3af;">${appt.meetingLink}</span>
//           </p>
//           `
//           : `
//           <p style="font-size:13px;color:#9ca3af;">
//           </p>
//           `
//         }
         
//           <h3 style="margin-bottom:8px;color:#ffffff;">Contact Details</h3>
//           <ul style="list-style:none;padding-left:0;font-size:14px;">
//             <li><b>Name:</b> ${appt.name}</li>
//             <li><b>Email:</b> ${appt.email}</li>
//             <li><b>Phone:</b> ${appt.phone || "(not provided)"}</li>
//             <li><b>Service / Topic:</b> ${appt.serviceType || "(not specified)"}</li>
//           </ul>

//           ${appt.notes
//           ? `<h3 style="margin-bottom:8px;color:#ffffff;">Notes</h3>
//                  <p style="font-size:14px;white-space:pre-wrap;">${appt.notes}</p>`
//           : ""
//         }

//           <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
//             Appointment ID: ${appt.id}<br/>
//             Created at: ${(appt.createdAt || new Date()).toLocaleString()}
//           </p>
//         </div>
//       </body>
//       </html>
//     `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Appointment notification emailed to", adminEmail);
//     return { success: true, method: "smtp" };
//   } catch (error) {
//     console.error("❌ Failed to send appointment email:", error);
//     return { success: false, error };
//   }
// }

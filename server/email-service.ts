import nodemailer from "nodemailer";
import { notificationService } from "./notification-service";

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  submittedAt: Date;
}

// Simple email notification using nodemailer (works with Gmail, Outlook, etc.)
export async function sendContactNotification(submission: ContactSubmission) {
  // Store notification in memory for admin panel viewing
  notificationService.addNotification("contact_form", {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    phone: submission.phone,
    message: submission.message,
    submittedAt: submission.submittedAt,
  });

  // Log prominently in console
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

  // Try webhook if configured
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

// Alternative: Set up Gmail SMTP (if you want to use Gmail)
export async function sendEmailViaGmail(submission: {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}) {
  // Use ENV credentials (recommended)
  const SMTP_USER = process.env.GMAIL_USER || "praveens.monarch@gmail.com"; // fallback for local testing
  const SMTP_PASS =
    process.env.GMAIL_APP_PASSWORD || "gbeh eeiv yzoa ygvv"; // fallback for local testing

  if (!SMTP_USER || !SMTP_PASS) {
    console.log(
      "Gmail credentials not configured, falling back to console logging",
    );
    console.log("Submission:", submission);
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_USER,
      to: submission.email, // send confirmation to subscriber
      subject: "Newsletter Subscription Confirmation",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Subscription Confirmation</title>
      </head>
      <body style="margin:0; padding:0; font-family: 'Poppins', Arial, sans-serif; 
        background: linear-gradient(to right, #CF4163, #552265); color:#fff;">

        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <!-- Card -->
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

                    <!-- Highlights -->
                    <table cellpadding="8" cellspacing="0" width="100%" 
                      style="margin:20px 0; text-align:left; font-size:14px; color:#fff;">
                      <tr><td>✅ Fast client-winning strategies</td></tr>
                      <tr><td>✅ Pricing & proposal hacks</td></tr>
                      <tr><td>✅ AI & automation tips</td></tr>
                      <tr><td>✅ Real stories from agencies like yours</td></tr>
                    </table>

                    <!-- Call to action -->
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
              <!-- End Card -->
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to", submission.email);
    return { success: true, method: "gmail" };
  } catch (error) {
    console.error("Gmail send failed:", error);
    return { success: false, method: "failed" };
  }
}

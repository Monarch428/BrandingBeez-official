// import nodemailer from "nodemailer";
// import { notificationService } from "./notification-service";

// interface ContactSubmission {
//   name: string;
//   email: string;
//   company?: string;
//   phone?: string;
//   message: string;
//   submittedAt: Date;
// }

// // Simple email notification using nodemailer (works with Gmail, Outlook, etc.)
// export async function sendContactNotification(submission: ContactSubmission) {
//   // Store notification in memory for admin panel viewing
//   notificationService.addNotification("contact_form", {
//     name: submission.name,
//     email: submission.email,
//     company: submission.company,
//     phone: submission.phone,
//     message: submission.message,
//     submittedAt: submission.submittedAt,
//   });

//   // Log prominently in console
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

//   // Try webhook if configured
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

// // Alternative: Set up Gmail SMTP (if you want to use Gmail)
// export async function sendEmailViaGmail(submission: {
//   name: string;
//   email: string;
//   message: string;
//   submittedAt: Date;
// }) {
//   // Use ENV credentials (recommended)
//   const SMTP_USER = process.env.SMTP_USER; 
//   const SMTP_PASS =
//     process.env.SMTP_PASSWORD; 

//   if (!SMTP_USER || !SMTP_PASS) {
//     console.log(
//       "Gmail credentials not configured, falling back to console logging",
//     );
//     console.log("Submission:", submission);
//     return { success: true, method: "console_log" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: SMTP_USER,
//       to: submission.email, // send confirmation to subscriber
//       subject: "Newsletter Subscription Confirmation",
//       html: `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Subscription Confirmation</title>
//       </head>
//       <body style="margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; 
//         background: linear-gradient(to right, #CF4163, #552265); color:#fff;">

//         <table width="100%" cellspacing="0" cellpadding="0">
//           <tr>
//             <td align="center" style="padding: 40px 0;">
//               <!-- Card -->
//               <table width="600" cellpadding="20" cellspacing="0" 
//                 style="background: rgba(255,255,255,0.1); border-radius:12px; 
//                 box-shadow:0 4px 12px rgba(0,0,0,0.2); backdrop-filter: blur(6px);">
//                 <tr>
//                   <td align="center" style="text-align:center;">
//                     <h1 style="color:#fff; margin-bottom:8px; font-size:24px;">
//                       Welcome to Our Newsletter 🎉
//                     </h1>
//                     <p style="color:#f3f3f3; font-size:16px; margin:0;">
//                       Hello <b>${submission.name}</b>, thanks for subscribing!
//                     </p>
//                     <p style="color:#ddd; font-size:14px; margin:16px 0;">
//                       You'll now receive short, practical tips and tools to grow your agency – 
//                       all in a quick 1-minute read.
//                     </p>

//                     <!-- Highlights -->
//                     <table cellpadding="8" cellspacing="0" width="100%" 
//                       style="margin:20px 0; text-align:left; font-size:14px; color:#fff;">
//                       <tr><td>✅ Fast client-winning strategies</td></tr>
//                       <tr><td>✅ Pricing & proposal hacks</td></tr>
//                       <tr><td>✅ AI & automation tips</td></tr>
//                       <tr><td>✅ Real stories from agencies like yours</td></tr>
//                     </table>

//                     <!-- Call to action -->
//                     <a href="#" 
//                       style="display:inline-block; background:#fff; color:#552265; 
//                       text-decoration:none; padding:12px 24px; border-radius:8px; 
//                       font-weight:bold; margin-top:16px;">
//                       Explore Resources
//                     </a>

//                     <p style="margin-top:24px; font-size:12px; color:#ccc;">
//                       Subscribed at: ${submission.submittedAt.toLocaleString()}
//                     </p>
//                   </td>
//                 </tr>
//               </table>
//               <!-- End Card -->
//             </td>
//           </tr>
//         </table>
//       </body>
//       </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent to", submission.email);
//     return { success: true, method: "gmail" };
//   } catch (error) {
//     console.error("Gmail send failed:", error);
//     return { success: false, method: "failed" };
//   }
// }





import path from "path";
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
  // Store notification in memory for admin panel viewing
  notificationService.addNotification("custom_app_questionnaire", {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    phone: submission.phone,
    questionnaire: submission.questionnaire,
    submittedAt: submission.submittedAt || new Date(),
  });

  const SMTP_HOST = process.env.SMTP_HOST || "smtppro.zoho.in";
  const SMTP_PORT = process.env.SMTP_PORT || "465";
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASSWORD;

  // const adminEmail = "pradeep.brandingbeez@gmail.com";
  const adminEmail = "info@brandingbeez.co.uk";


  // Build text content for attachment
  const lines: string[] = [];
  lines.push("Custom App Questionnaire Submission");
  lines.push("Submitted At: " + (submission.submittedAt || new Date()).toString());
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
    if (Array.isArray(q.userTypes)) lines.push(`User Types: ${q.userTypes.join(", ")}`);
    if (Array.isArray(q.mustHaveFeatures)) lines.push(`Must-Have Features: ${q.mustHaveFeatures.join(", ")}`);
    if (q.customFeatureDetails) lines.push(`Custom Feature Details: ${q.customFeatureDetails}`);
    if (q.referenceApps) lines.push(`Reference Apps: ${q.referenceApps}`);
    if (q.buildType) lines.push(`Build Type: ${q.buildType}`);
    if (q.projectTimeline) lines.push(`Timeline: ${q.projectTimeline}`);
    if (q.budgetRange) lines.push(`Budget: ${q.budgetRange}`);
    if (Array.isArray(q.techPreferences)) lines.push(`Tech Preferences: ${q.techPreferences.join(", ")}`);
  } catch (err) {
    lines.push("(Error building questionnaire text)");
    lines.push(JSON.stringify(q));
  }

  const attachmentContent = lines.join("\n");

  // If SMTP not configured, just log and return (notification already stored)
  if (!SMTP_USER || !SMTP_PASS) {
    console.log("SMTP credentials not configured. Questionnaire content:\n", attachmentContent);
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const filenameTxt = `custom-app-questionnaire-${Date.now()}.txt`;
    const filenameDoc = filenameTxt.replace(/\.txt$/, ".doc");

    const mailOptions = {
      from: SMTP_USER,
      to: adminEmail,
      subject: `New Custom App Questionnaire from ${submission.name}`,
      text: `New questionnaire submitted by ${submission.name} <${submission.email}>. See attached file for full answers.`,
      attachments: [
        {
          filename: filenameTxt,
          content: attachmentContent,
        },
        // Also attach a .doc copy (plain text) so recipients expecting a Word doc see an attachment
        {
          filename: filenameDoc,
          content: attachmentContent,
          contentType: "application/msword",
        },
      ],
    };

    // If server saved an uploaded questionnaire file, attach it as well
    if ((submission as any).file && (submission as any).file.path) {
      const f: any = (submission as any).file;
      // Push the uploaded file as an attachment (keep original filename)
      (mailOptions as any).attachments.push({
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

// -----------------------------------------------------
// Gmail SMTP - Backup Method (Still kept – not removed)
// -----------------------------------------------------
// export async function sendEmailViaGmail(submission: {
//   name: string;
//   email: string;
//   message: string;
//   submittedAt: Date;
// }) {
//   const SMTP_USER = process.env.SMTP_USER; 
//   const SMTP_PASS = process.env.SMTP_PASSWORD; 

//   if (!SMTP_USER || !SMTP_PASS) {
//     console.log("Gmail credentials not configured, falling back to console logging");
//     console.log("Submission:", submission);
//     return { success: true, method: "console_log" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: SMTP_USER,
//       to: submission.email,
//       subject: "Newsletter Subscription Confirmation",
//       html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <body>
//           <h1>Thanks ${submission.name}!</h1>
//           <p>You subscribed via Gmail SMTP.</p>
//           <p>Submitted at: ${submission.submittedAt.toLocaleString()}</p>
//         </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent via Gmail to", submission.email);
//     return { success: true, method: "gmail" };
//   } catch (error) {
//     console.error("Gmail send failed:", error);
//     return { success: false, method: "failed" };
//   }
// }

// -----------------------------------------------------
// NEW — ZOHO SMTP METHOD (Preferred)
// -----------------------------------------------------
export async function sendEmailViaGmail(submission: {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}) {
  const SMTP_HOST = process.env.SMTP_HOST || "smtppro.zoho.in";
  const SMTP_PORT = process.env.SMTP_PORT || "465";
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASSWORD;

  if (!SMTP_USER || !SMTP_PASS) {
    console.log("Zoho SMTP credentials not configured, falling back to console logging");
    console.log("Submission:", submission);
    return { success: true, method: "console_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_USER,
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
    console.log("Email sent via Zoho SMTP to", submission.email);
    return { success: true, method: "zoho_smtp" };
  } catch (error) {
    console.error("Zoho SMTP send failed:", error);
    return { success: false, method: "failed" };
  }
}

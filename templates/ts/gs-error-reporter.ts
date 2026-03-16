// @ts-nocheck
import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from 'next';

/* This route receives error reports from gs-error-reporter
   and emails them to the developer.
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we only process POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // In Pages router, req.body is already parsed if content-type is application/json
    const payload = req.body;

    /* ---------- EMAIL SUBJECT ---------- */

    const subject = `🚨 [${payload.payload.type?.toUpperCase()}] ${payload.payload.message || "Unknown Error"}`;

    /* ---------- HTML FORMATTER ---------- */

    const html = `
    <body style="font-family: Arial, sans-serif; background:#f4f4f7; padding:20px;">
      <div style="max-width:650px; margin:auto; background:white; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <h2 style="color:#d32f2f; margin-top:0;">🚨 GS Error Reporter</h2>

        <h3>🧠 Error Information</h3>
        <p><strong>Runtime:</strong> ${payload.payload.type}</p>
        <p><strong>Message:</strong> ${payload.payload.message}</p>
        <p><strong>Environment:</strong> ${payload.payload.environment}</p>
        <p><strong>Time:</strong> ${payload.payload.timestamp}</p>

        <hr/>

        <h3>🌍 Request Context</h3>
        <p><strong>URL:</strong> ${payload.payload.url || "N/A"}</p>
        <p><strong>Method:</strong> ${payload.payload.method || "N/A"}</p>

        <hr/>

        <h3>💻 System Information</h3>
        <p><strong>User Agent:</strong> ${payload.payload.userAgent || "Server Runtime"}</p>
        <p><strong>Language:</strong> ${payload.payload.language || "N/A"}</p>
        <p><strong>Node Version:</strong> ${payload.payload.nodeVersion || "N/A"}</p>
        <p><strong>Platform:</strong> ${payload.payload.platform || "N/A"}</p>

        <hr/>

        <h3>📄 Stack Trace</h3>
        <pre style="background:#111; color:#0f0; padding:14px; border-radius:8px; font-size:12px; overflow-x:auto;">
          ${payload.payload.stack || "No stack trace available"}
        </pre>

        ${payload.payload.extra
        ? `
        <hr/>
        <h3>🧩 Extra Data</h3>
        <pre style="background:#f7f7f7; padding:12px; border-radius:8px; font-size:12px;">
          ${JSON.stringify(payload.payload.extra, null, 2)}
        </pre>`
        : ""
      }

        <p style="margin-top:30px; font-size:12px; color:#888; text-align:center;">
          Sent automatically by <b>gs-error-reporter</b>
        </p>

      </div>
    </body>
    `;

    /* ---------- NODEMAILER ---------- */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GS_REPORTER_EMAIL,
        pass: process.env.GS_REPORTER_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GS_REPORTER_EMAIL,
      to: process.env.GS_REPORTER_RECEIVER,
      subject,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("gs-error-reporter mail route failed:", err);
    return res.status(500).json({ success: false });
  }
}
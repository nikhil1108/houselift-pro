import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const TARGET_EMAIL = "buildinglifting83@gmail.com";

interface LeadPayload {
  name: string;
  phone: string;
  city: string;
  areaSqFt: string | number;
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();
    const { name, phone, city, areaSqFt } = body;

    // Basic server-side validation
    if (!name || !phone || !city || !areaSqFt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // 1. Save lead to local audit file so no lead is ever lost
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const leadsFile = path.join(dataDir, "leads.json");
      let currentLeads: Record<string, unknown>[] = [];
      if (fs.existsSync(leadsFile)) {
        try {
          const content = fs.readFileSync(leadsFile, "utf-8");
          currentLeads = JSON.parse(content);
        } catch {
          currentLeads = [];
        }
      }
      currentLeads.unshift({
        name,
        phone,
        city,
        areaSqFt,
        submittedAt: timestamp,
      });
      fs.writeFileSync(leadsFile, JSON.stringify(currentLeads, null, 2));
    } catch (saveError) {
      console.error("[Leads Store] Could not write lead to file:", saveError);
    }

    // 2. Prepare HTML & Text Email Copy
    const emailSubject = `🚨 New Survey Request: ${name} (${city}) - RR and Sons`;
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: left; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #f59e0b; font-family: monospace; letter-spacing: 0.05em; text-transform: uppercase; }
          .body { padding: 28px; color: #1e293b; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 600; font-size: 12px; padding: 4px 10px; border-radius: 6px; margin-bottom: 20px; }
          .field-group { margin-bottom: 18px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; }
          .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-family: monospace; margin-bottom: 4px; }
          .field-value { font-size: 16px; font-weight: 600; color: #0f172a; }
          .action-btn { display: inline-block; background: #d97706; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 12px; margin-right: 10px; }
          .wa-btn { display: inline-block; background: #25d366; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 12px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>RR and Sons Building Solution PVT LTD</h1>
            <p>New Site Survey Booking</p>
          </div>
          <div class="body">
            <span class="badge">Submitted via Website Lead Form</span>

            <div class="field-group">
              <div class="field-label">Customer Name</div>
              <div class="field-value">${name}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Mobile Number</div>
              <div class="field-value">${phone}</div>
            </div>

            <div class="field-group">
              <div class="field-label">City / Location</div>
              <div class="field-value">${city}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Built-up Area</div>
              <div class="field-value">${areaSqFt} sq ft</div>
            </div>

            <div class="field-group" style="border-bottom: none;">
              <div class="field-label">Submission Date & Time</div>
              <div class="field-value" style="font-size: 13px; font-family: monospace; color: #475569;">${timestamp}</div>
            </div>

            <div style="margin-top: 24px;">
              <a href="tel:${cleanPhone}" class="action-btn">📞 Call Customer</a>
              <a href="https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}" class="wa-btn">💬 WhatsApp Customer</a>
            </div>
          </div>
          <div class="footer">
            This lead was automatically dispatched to ${TARGET_EMAIL}.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEW SITE SURVEY REQUEST - RR and Sons Building Solution PVT LTD
=============================================================

Customer Name:  ${name}
Mobile Number:  ${phone}
City/Location:  ${city}
Built-up Area:  ${areaSqFt} sq ft
Timestamp:      ${timestamp}

Direct Call:    tel:${cleanPhone}
WhatsApp Link:  https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}

This notification was automatically sent to ${TARGET_EMAIL}.
    `.trim();

    // 3. Check for SMTP credentials in environment
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"RR and Sons Website" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: TARGET_EMAIL,
          subject: emailSubject,
          text: textContent,
          html: htmlContent,
        });

        console.log(`[Email Dispatch] Successfully delivered email to ${TARGET_EMAIL}`);
      } catch (mailError) {
        console.error("[Email Dispatch Error] Failed to send email:", mailError);
      }
    } else {
      console.log(
        `[Email Dispatch Note] Lead recorded in data/leads.json. To activate live SMTP sending to ${TARGET_EMAIL}, configure SMTP_USER & SMTP_PASS in .env.local.`,
      );
    }

    // 4. Dispatch instant WhatsApp notification to Admin / Owner
    const waResult = await dispatchWhatsAppAlert({
      name,
      phone,
      city,
      areaSqFt,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: `Enquiry logged and queued for ${TARGET_EMAIL}`,
      recipient: TARGET_EMAIL,
      timestamp,
      whatsappNotified: waResult.sent,
    });
  } catch (error: unknown) {
    console.error("[Survey API Error]", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details },
      { status: 500 },
    );
  }
}

interface WhatsAppAlertData {
  name: string;
  phone: string;
  city: string;
  areaSqFt: string | number;
  timestamp: string;
}

/**
 * Sends an instant WhatsApp alert to the business owner/admin whenever an enquiry is submitted.
 * Supports:
 *  1. CallMeBot (100% Free personal WhatsApp alert)
 *  2. Custom Webhook (Zapier, Make, Wati, AiSensy, UltraMsg, Telegram)
 *  3. Twilio WhatsApp API
 */
async function dispatchWhatsAppAlert(lead: WhatsAppAlertData): Promise<{ sent: boolean }> {
  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const formattedCustomerNumber = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  const message = [
    "🚨 *NEW SITE SURVEY ENQUIRY - RR & SONS*",
    "━━━━━━━━━━━━━━━━━━━━━",
    `👤 *Name:* ${lead.name}`,
    `📱 *Phone:* ${lead.phone}`,
    `📍 *City:* ${lead.city}`,
    `📐 *Area:* ${lead.areaSqFt} sq ft`,
    `⏰ *Time:* ${lead.timestamp}`,
    "━━━━━━━━━━━━━━━━━━━━━",
    `📞 *Direct Call:* tel:${cleanPhone}`,
    `💬 *WhatsApp Customer:* https://wa.me/${formattedCustomerNumber}`,
  ].join("\n");

  let dispatched = false;

  // 1. CallMeBot WhatsApp API (Free personal WhatsApp alerts)
  const callmebotPhone = process.env.CALLMEBOT_PHONE || process.env.WHATSAPP_ADMIN_PHONE;
  const callmebotApiKey = process.env.CALLMEBOT_API_KEY || process.env.WHATSAPP_CALLMEBOT_API_KEY;

  if (callmebotPhone && callmebotApiKey) {
    try {
      const cleanAdminPhone = callmebotPhone.replace(/[^0-9]/g, "");
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanAdminPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApiKey}`;
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        console.log(`[WhatsApp Dispatch] Instant alert sent to owner via CallMeBot (${cleanAdminPhone})`);
        dispatched = true;
      } else {
        const errText = await res.text();
        console.warn(`[WhatsApp Dispatch Warning] CallMeBot status ${res.status}:`, errText);
      }
    } catch (botErr) {
      console.error("[WhatsApp Dispatch Error] Failed to reach CallMeBot:", botErr);
    }
  }

  // 2. Custom Webhook (e.g. Zapier, Make, Wati, AiSensy, UltraMsg)
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "new_survey_lead",
          lead: {
            name: lead.name,
            phone: lead.phone,
            city: lead.city,
            areaSqFt: lead.areaSqFt,
            timestamp: lead.timestamp,
            customerWhatsAppLink: `https://wa.me/${formattedCustomerNumber}`,
          },
          message,
        }),
      });
      if (res.ok) {
        console.log("[WhatsApp Dispatch] Dispatched to custom webhook successfully");
        dispatched = true;
      }
    } catch (whErr) {
      console.error("[WhatsApp Dispatch Error] Webhook delivery failed:", whErr);
    }
  }

  // 3. Twilio WhatsApp API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;
  const twilioTo = process.env.TWILIO_WHATSAPP_TO || process.env.WHATSAPP_ADMIN_PHONE;

  if (twilioSid && twilioAuth && twilioFrom && twilioTo) {
    try {
      const cleanTo = twilioTo.startsWith("whatsapp:")
        ? twilioTo
        : `whatsapp:${twilioTo.startsWith("+") ? twilioTo : "+" + twilioTo.replace(/[^0-9]/g, "")}`;
      const cleanFrom = twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`;
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");

      const params = new URLSearchParams();
      params.append("From", cleanFrom);
      params.append("To", cleanTo);
      params.append("Body", message);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (res.ok) {
        console.log(`[WhatsApp Dispatch] Sent Twilio WhatsApp alert to ${cleanTo}`);
        dispatched = true;
      } else {
        const errJson = await res.json();
        console.warn("[WhatsApp Dispatch Warning] Twilio returned error:", errJson);
      }
    } catch (twErr) {
      console.error("[WhatsApp Dispatch Error] Twilio delivery failed:", twErr);
    }
  }

  if (!dispatched && !callmebotApiKey && !webhookUrl && !twilioSid) {
    console.log(
      "[WhatsApp Dispatch Note] Lead recorded. To receive instant WhatsApp alerts on your phone, configure CALLMEBOT_API_KEY and WHATSAPP_ADMIN_PHONE in .env.local.",
    );
  }

  return { sent: dispatched };
}


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, intent, message } = await req.json();

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Skipping lead capture.");
      return NextResponse.json({ success: true, warning: "Webhook URL missing" });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name || "Unknown",
        intent: intent || "Unknown",
        message: message || "",
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Scripts responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending lead to Google Sheets:", error);
    return NextResponse.json(
      { error: "Failed to capture lead." },
      { status: 500 }
    );
  }
}

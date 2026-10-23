// Sends every Sahayika conversation turn to the Google Sheets webhook.
// Every visitor message is logged (one row per message); filtering happens in the sheet.

export interface Lead {
  sessionId: string;
  name: string;
  intent: string;
  message: string; // all visitor messages so far, " | " separated
  latest: string; // the message that triggered this row
}

const ATTEMPTS = 3;

export async function sendLead(lead: Lead) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set: lead NOT captured", lead);
    return;
  }
  const body = JSON.stringify({ ...lead, timestamp: new Date().toISOString() });

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      // Apps Script answers a successful POST with a 302 to its output page;
      // don't follow it, the row is already written by then.
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok || (res.status >= 300 && res.status < 400)) return;
      console.error(`Lead webhook attempt ${attempt} failed: HTTP ${res.status}`);
    } catch (error) {
      console.error(`Lead webhook attempt ${attempt} failed:`, error);
    }
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, attempt * 1000));
  }
  console.error("Lead NOT captured after retries:", lead);
}

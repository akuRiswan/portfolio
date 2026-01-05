export default async function handler(req, res) {
  const { name, email, message } = req.body;
  // Allow CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = req.body || {};

    const token = api.env.TELEGRAM_TOKEN;
    const chatId = api.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const payload = {
      chat_id: chatId,
      text: `New Message!\nName: ${name || "(no name)"}\nEmail: ${email || "(no email)"}\nMessage: ${message || "(no message)"}`,
      parse_mode: "HTML",
    };

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    // Mirror CORS header for browser clients
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!response.ok) {
      console.error("Telegram API error", response.status, data);
      return res.status(response.status || 500).json({ error: data || "Telegram API error" });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error(err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Internal server error" });
  }
}

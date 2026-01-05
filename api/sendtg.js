const axios = require("axios");

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  // Mengambil token dari Environment Variables Vercel
  const token = api.env.TELEGRAM_TOKEN;
  const chatId = api.env.TELEGRAM_CHAT_ID;

  const text = `
<b>New Message from WebPortfolio!</b>
<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Message:</b> ${message}
  `;

  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

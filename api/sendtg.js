import axios from "axios"; // Gunakan import, bukan require

export default async function handler(req, res) {
  // Gunakan export default
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;
  const token = process.env.TELEGRAM_TOKEN; // Perbaikan: Gunakan process.env
  const chatId = process.env.TELEGRAM_CHAT_ID; // Perbaikan: Gunakan process.env

  const text = `<b>New Message from Portfolio!</b>\n<b>Name:</b> ${name}\n<b>Email:</b> ${email}\n<b>Message:</b> ${message}`;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

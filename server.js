const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Mengambil variabel dari api.env
dotenv.config({ path: "./api.env" });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Menangani request POST dari script.js
app.post("./api/sendtg", async (req, res) => {
  const { name, email, message } = req.body;
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

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
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error ke Telegram:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: "Gagal mengirim ke Telegram" });
  }
});

app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});

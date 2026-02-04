const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN } = require("./config");

const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 30
    }
  }
});

bot.on("polling_error", (err) => {
  if (!err || Object.keys(err).length === 0) return;
  console.log("⚠️ Polling error:", err.message || err);
});

bot.on("webhook_error", (err) => {
  console.log("⚠️ Webhook error:", err.message);
});

module.exports = bot;

console.log("✅ Anime bot ishga tushdi");


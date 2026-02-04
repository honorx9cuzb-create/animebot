const db = require("../db");
const searchState = new Set();

module.exports = (bot) => {

  bot.onText(/^\/search$/, (msg) => {
    searchState.add(msg.from.id);
    bot.sendMessage(msg.chat.id, "🔍 Anime ID yoki nomini yozing:");
  });

  bot.onText(/^\/search (.+)/, (msg, m) => {
    showResults(bot, msg, m[1]);
  });

  bot.on("message", (msg) => {
    if (!searchState.has(msg.from.id)) return;
    if (!msg.text || msg.text.startsWith("/")) return;

    searchState.delete(msg.from.id);
    showResults(bot, msg, msg.text);
  });

  function showResults(bot, msg, query) {
    const animes = db.getAnimes();
    const q = query.toLowerCase();

    const kb = Object.entries(animes)
      .filter(([id, a]) =>
        id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
      )
      .map(([id, a]) => [{
        text: `${a.name} (ID: ${id})`,
        callback_data: `ANIME_${id}`
      }]);

    if (!kb.length)
      return bot.sendMessage(msg.chat.id, "❌ Anime topilmadi");

    bot.sendMessage(msg.chat.id, "🎌 Anime tanlang:", {
      reply_markup: { inline_keyboard: kb }
    });
  }
};

const db = require("../db");
const { ADMIN_ID } = require("../config");
const state = new Map();

module.exports = (bot) => {

  bot.onText(/\/admin/, (msg) => {
    if (msg.from.id !== ADMIN_ID) return;

    bot.sendMessage(msg.chat.id, "👮 Admin Panel", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Anime", callback_data: "ADD_ANIME" }],
          [{ text: "➕ Season", callback_data: "ADD_SEASON" }],
          [{ text: "➕ Episode", callback_data: "ADD_EPISODE" }],
          [{ text: "🗑 Anime", callback_data: "DEL_ANIME" }]
        ]
      }
    });
  });

  bot.on("callback_query", (q) => {
    if (q.from.id !== ADMIN_ID) return;

    if (q.data === "ADD_ANIME") {
      state.set(q.from.id, "ANIME");
      return bot.sendMessage(q.message.chat.id, "🆔 Anime ID yubor:");
    }

    if (q.data === "ADD_SEASON") {
      state.set(q.from.id, "SEASON_ANIME");
      return bot.sendMessage(q.message.chat.id, "🎌 Anime ID yubor:");
    }

    if (q.data === "ADD_EPISODE") {
      state.set(q.from.id, "EP_ANIME");
      return bot.sendMessage(q.message.chat.id, "🎌 Anime ID yubor:");
    }
  });

  bot.on("message", (msg) => {
    if (msg.from.id !== ADMIN_ID) return;
    const step = state.get(msg.from.id);
    if (!step) return;

    // ADD ANIME
    if (step === "ANIME") {
      db.addAnime(msg.text);
      state.delete(msg.from.id);
      return bot.sendMessage(msg.chat.id, "✅ Anime qo‘shildi");
    }

    // ADD SEASON
    if (step === "SEASON_ANIME") {
      state.set(msg.from.id, { step: "SEASON_NUM", anime: msg.text });
      return bot.sendMessage(msg.chat.id, "📂 Season raqami:");
    }

    if (step.step === "SEASON_NUM") {
      db.addSeason(step.anime, msg.text);
      state.delete(msg.from.id);
      return bot.sendMessage(msg.chat.id, "✅ Season qo‘shildi");
    }

    // ADD EPISODE
    if (step === "EP_ANIME") {
      state.set(msg.from.id, { step: "EP_SEASON", anime: msg.text });
      return bot.sendMessage(msg.chat.id, "📂 Season raqami:");
    }

    if (step.step === "EP_SEASON") {
      state.set(msg.from.id, { step: "EP_VIDEO", anime: step.anime, season: msg.text });
      return bot.sendMessage(msg.chat.id, "🎬 Video forward qil:");
    }

    if (step.step === "EP_VIDEO" && msg.video) {
      db.addEpisode(step.anime, step.season, msg.video.file_id);
      state.delete(msg.from.id);
      return bot.sendMessage(msg.chat.id, "✅ Episode qo‘shildi");
    }
  });
};

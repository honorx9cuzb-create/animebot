const { db } = require("../db");

module.exports = (bot) => {
  bot.on("callback_query", async (q) => {
    if (!q.data.startsWith("anime_")) return;

    const animeId = q.data.split("_")[1];

    const snap = await db
      .collection("animes")
      .doc(animeId)
      .collection("seasons")
      .get();

    let kb = snap.docs.map(s => [{
      text: `Season ${s.id}`,
      callback_data: `season_${animeId}_${s.id}_1`
    }]);

    bot.sendMessage(q.message.chat.id, "📂 Season tanlang:", {
      reply_markup: { inline_keyboard: kb }
    });
  });
};

const { db } = require("../db");
const PAGE_SIZE = 5;

module.exports = (bot) => {

  bot.on("callback_query", async (q) => {
    if (!q.data.startsWith("season_")) return;

    const [, animeId, seasonId, pageStr] = q.data.split("_");
    const page = Number(pageStr);

    const snap = await db
      .collection("animes").doc(animeId)
      .collection("seasons").doc(seasonId)
      .collection("episodes")
      .orderBy("number")
      .get();

    const eps = snap.docs;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    let kb = [];

    eps.slice(start, end).forEach(ep => {
      kb.push([{
        text: `▶ ${ep.data().title}`,
        callback_data: `play_${animeId}_${seasonId}_${ep.id}`
      }]);
    });

    let nav = [];
    if (start > 0)
      nav.push({ text: "⬅️", callback_data: `season_${animeId}_${seasonId}_${page - 1}` });
    if (end < eps.length)
      nav.push({ text: "➡️", callback_data: `season_${animeId}_${seasonId}_${page + 1}` });
    if (nav.length) kb.push(nav);

    bot.editMessageText(
      `🎬 Episodes (Season ${seasonId})`,
      {
        chat_id: q.message.chat.id,
        message_id: q.message.message_id,
        reply_markup: { inline_keyboard: kb }
      }
    );
  });

  bot.on("callback_query", async (q) => {
    if (!q.data.startsWith("play_")) return;

    const [, animeId, seasonId, epId] = q.data.split("_");

    const ep = await db
      .collection("animes").doc(animeId)
      .collection("seasons").doc(seasonId)
      .collection("episodes").doc(epId)
      .get();

    bot.sendVideo(
      q.message.chat.id,
      ep.data().fileId,
      { caption: ep.data().title }
    );
  });
};

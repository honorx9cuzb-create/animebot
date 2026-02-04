const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data.json");

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ animes: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getAnimes() {
    return load().animes;
  },

  addAnime(id) {
    const db = load();
    if (!db.animes[id]) {
      db.animes[id] = { seasons: {} };
      save(db);
    }
  },

  deleteAnime(id) {
    const db = load();
    delete db.animes[id];
    save(db);
  },

  addSeason(animeId, seasonId) {
    const db = load();
    if (!db.animes[animeId]) return;
    db.animes[animeId].seasons[seasonId] = { episodes: {} };
    save(db);
  },

  addEpisode(animeId, seasonId, fileId) {
    const db = load();
    const season = db.animes[animeId].seasons[seasonId];
    const epNum = Object.keys(season.episodes).length + 1;
    season.episodes[epNum] = {
      title: `Episode ${epNum}`,
      fileId
    };
    save(db);
  }
};

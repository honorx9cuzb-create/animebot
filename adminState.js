const map = new Map();

module.exports = {
  set(id, data) {
    map.set(id, data);
  },
  get(id) {
    return map.get(id);
  },
  clear(id) {
    map.delete(id);
  }
};

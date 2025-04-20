const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./kkbox');
const BlockedError = require('../include/blocked-error');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
    if (error.code === 'ECONNRESET') {
      console.warn('Connection rest');
      return;
    }
  }

  assert.strictEqual(inst.title, title);
  assert.strictEqual(inst.artist, artist);
  if (lyricist) assert.strictEqual(inst.lyricist, lyricist);
  if (composer) assert.strictEqual(inst.composer, composer);
  if (arranger) assert.strictEqual(inst.arranger, arranger);
  if (length > 0) assert.strictEqual(inst.lyric.length, length);
}

test('', async () => {
  await testLyric({
    url: 'https://www.kkbox.com/tw/tc/song/yZdhFjM058t9XJz7TJz7T0P4-index.html',
    title: '無敵鐵金剛',
    artist: '盧廣仲 (Crowd Lu)',
    lyricist: '盧廣仲',
    composer: '盧廣仲',
    length: 370,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.kkbox.com/jp/ja/song/b0h00IP8n.YTkRIeTkRIe0XL-index.html',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]',
    lyricist: 'Hiroyuki Sawano・Tielle',
    composer: 'Hiroyuki Sawano',
    length: 1462,
  });
});

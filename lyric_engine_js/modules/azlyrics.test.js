const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./azlyrics');
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
    url: 'https://www.azlyrics.com/lyrics/coldplay/adventureofalifetime.html',
    title: 'Adventure Of A Lifetime',
    artist: 'Coldplay',
    length: 1154,
  });
});

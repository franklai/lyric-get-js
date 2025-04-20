const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./genius');
const BlockedError = require('../include/blocked-error');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, length } = object;
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
  if (length > 0) assert.strictEqual(inst.lyric.length, length);
}

test('genius, Hollow Coves - Coastline', async () => {
  await testLyric({
    url: 'https://genius.com/Hollow-coves-coastline-lyrics',
    title: 'Coastline',
    artist: 'Hollow Coves',
    length: 1078,
  });
});

test('genius, Sakamoto Maaya- tune the rainbow', async () => {
  await testLyric({
    url: 'https://genius.com/Maaya-sakamoto-tune-the-rainbow-lyrics',
    title: '​tune the rainbow',
    artist: '坂本真綾 (Maaya Sakamoto)',
    length: 520,
  });
});

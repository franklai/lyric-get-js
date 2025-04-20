const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./musixmatch');
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
    url: 'https://www.musixmatch.com/lyrics/SawanoHiroyuki-nZk-Tielle-Gemie/sh0ut',
    title: 'sh0ut',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    length: 1957,
  });
});

test('Maaya Sakamoto - Tune the Rainbow', async () => {
  await testLyric({
    url: 'https://www.musixmatch.com/lyrics/Maaya-Sakamoto/Tune-the-Rainbow',
    title: 'Tune the Rainbow',
    artist: 'Maaya Sakamoto',
    length: 500,
  });
});

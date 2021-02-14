/* global expect test */
const { Lyric } = require('./musixmatch');
const BlockedError = require('../include/blocked_error');

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

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url:
      'https://www.musixmatch.com/lyrics/SawanoHiroyuki-nZk-Tielle-Gemie/sh0ut',
    title: 'sh0ut',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    length: 1719,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.musixmatch.com/lyrics/L-Arc-en-Ciel/Honey',
    title: 'Honey',
    artist: "L'Arc-en-Ciel",
    length: 433,
  });
});

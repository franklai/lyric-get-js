/* global expect test */
const { Lyric } = require('./musixmatch');
const BlockedError = require('../include/blocked_error');

async function testLyric(obj) {
  const { url } = obj;
  const inst = new Lyric(url);
  try {
    await inst.get();
  } catch (e) {
    if (e instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
  }

  expect(inst.title).toBe(obj.title);
  expect(inst.artist).toBe(obj.artist);
  if (obj.lyricist) expect(inst.lyricist).toBe(obj.lyricist);
  if (obj.composer) expect(inst.composer).toBe(obj.composer);
  if (obj.length) expect(inst.lyric.length).toBe(obj.length);
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
    title: "Honey",
    artist: "L'Arc-en-Ciel",
    length: 433,
  });
});

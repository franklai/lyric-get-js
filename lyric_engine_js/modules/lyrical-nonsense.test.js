const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./lyrical-nonsense');
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

test('lyrical-nonsense, LiSA - Homura', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/global/lyrics/lisa/homura/#Romaji',
    title: 'Homura',
    artist: 'LiSA',
    lyricist: 'Yuki Kajiura・LiSA',
    composer: 'Yuki Kajiura',
    length: 1019,
  });
});

test('lyrical-nonsense, 美波 - カワキヲアメク', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/lyrics/minami-373/kawaki-wo-ameku/',
    title: 'カワキヲアメク',
    artist: '美波',
    lyricist: '美波',
    composer: '美波',
    length: 748,
  });
});

test('lyrical-nonsense, Kenshi Yonezu - Lemon', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/global/lyrics/kenshi-yonezu/lemon/#Espanol',
    title: 'Lemon',
    artist: 'Kenshi Yonezu',
    length: 1665,
  });
});

test('lyrical-nonsense, Yorushika - Sunny', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/global/lyrics/yorushika/haru/',
    title: 'Sunny',
    artist: 'Yorushika',
    lyricist: 'n-buna',
    composer: 'n-buna',
    length: 1033,
  });
});

// https://www.lyrical-nonsense.com/lyrics/asca/resister/#LyricsPlus
// https://www.lyrical-nonsense.com/lyrics/kenshi-yonezu/lemon/#Espanol

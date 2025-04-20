const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./rocklyric');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  await inst.get();

  assert.strictEqual(inst.title, title);
  assert.strictEqual(inst.artist, artist);
  if (lyricist) assert.strictEqual(inst.lyricist, lyricist);
  if (composer) assert.strictEqual(inst.composer, composer);
  if (arranger) assert.strictEqual(inst.arranger, arranger);
  if (length > 0) assert.strictEqual(inst.lyric.length, length);
}

test('', async () => {
  await testLyric({
    url: 'https://rocklyric.jp/lyric.php?sid=172900',
    title: 'ANTHEM',
    artist: 'Royz',
    lyricist: 'Royz',
    composer: 'Royz',
    length: 659,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://rocklyric.jp/lyric.php?sid=175043',
    title: 'CASTLE OF THE NINE',
    artist: 'A9',
    lyricist: 'Show & Tora & Saga',
    composer: 'A9',
    length: 668,
  });
});

const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./kashinavi');

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
    url: 'https://kashinavi.com/song_view.html?65545',
    title: '猫背',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 366,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://kashinavi.com/song_view.html?77597',
    title: "We Don't Stop",
    artist: '西野カナ',
    lyricist: 'Kana Nishino・GIORGIO 13',
    composer: 'Giorgio Cancemi',
    length: 1260,
  });
});

const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./joysound');

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
    url: 'https://www.joysound.com/web/search/song/402005',
    title: 'SAVED.',
    artist: '坂本真綾',
    lyricist: '鈴木祥子',
    composer: '鈴木祥子',
    length: 397,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.joysound.com/web/search/song/96127',
    title: 'I.D.',
    artist: '坂本真綾',
    lyricist: '坂本真綾',
    composer: '菅野よう子',
    length: 394,
  });
});

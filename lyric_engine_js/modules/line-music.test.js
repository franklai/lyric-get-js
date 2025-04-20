const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./line-music');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  try {
    await inst.get();
  } catch (error) {
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

test('yorushika - spring thief', async () => {
  await testLyric({
    url: 'https://music.line.me/webapp/track/mt00000000125b0c3a',
    title: '春泥棒',
    artist: 'ヨルシカ',
  });
});

test('sakamoto maaya - tune the rainbow', async () => {
  await testLyric({
    url: 'https://music.line.me/webapp/track/mt000000000eb3d9c2',
    title: 'tune the rainbow',
    artist: '坂本 真綾',
  });
});

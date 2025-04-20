const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./j-lyric');

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
    url: 'https://j-lyric.net/artist/a002723/l001e83.html',
    title: 'tune the rainbow',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 447,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://j-lyric.net/artist/a000673/l000bea.html',
    title: '天体観測',
    artist: 'BUMP OF CHICKEN',
    lyricist: '藤原基央',
    composer: '藤原基央',
    length: 734,
  });
});

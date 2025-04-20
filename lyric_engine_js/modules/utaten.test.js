const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./utaten');

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

test('BUMP OF CHICKEN', async () => {
  await testLyric({
    url: 'https://utaten.com/lyric/jb81012024/',
    title: 'beautiful glider',
    artist: 'BUMP OF CHICKEN',
    lyricist: '藤原基央',
    composer: '藤原基央',
    length: 959,
  });
});

test('AAA', async () => {
  await testLyric({
    url: 'https://utaten.com/lyric/jb71110163/',
    title: 'Charge & Go!',
    artist: 'AAA',
    lyricist: 'Kenn Kato',
    composer: 'Tetsuya Komuro',
    length: 1256,
  });
});

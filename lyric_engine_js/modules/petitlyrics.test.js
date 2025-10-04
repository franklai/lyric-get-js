const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./petitlyrics');

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

test('gravityWall', async () => {
  await testLyric({
    url: 'https://petitlyrics.com/lyrics/2664469',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    lyricist: 'Hiroyuki Sawano/Tielle',
    composer: 'Hiroyuki Sawano',
    length: 985,
  });
});

test('灰色と青(+菅田将暉)', async () => {
  await testLyric({
    url: 'https://petitlyrics.com/lyrics/2669211',
    title: '灰色と青(+菅田将暉)',
    artist: '米津玄師',
    lyricist: '米津玄師',
    composer: '米津玄師',
    length: 629,
  });
});

const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./utamap');

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
    url: 'https://www.utamap.com/showkasi.php?surl=59709',
    title: 'One more time,One more chance',
    artist: '山崎まさよし',
    lyricist: '山崎将義',
    length: 794,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.utamap.com/showkasi.php?surl=k-131226-001',
    title: 'ちっぽけな愛のうた',
    artist: '小枝理子&小笠原秋',
    lyricist: '亀田誠治',
    composer: '亀田誠治',
    length: 572,
  });
});

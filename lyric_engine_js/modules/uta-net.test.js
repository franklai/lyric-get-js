const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./uta-net');

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
    url: 'https://www.uta-net.com/song/231884/',
    title: 'sh0ut',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    lyricist: 'Hiroyuki Sawano・Tielle',
    composer: 'Hiroyuki Sawano',
    length: 1881,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.uta-net.com/song/237845/',
    title: '灰色と青 ( + 菅田将暉)',
    artist: '米津玄師',
    lyricist: '米津玄師',
    composer: '米津玄師',
    length: 629,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.uta-net.com/song/322189/',
    title: 'JUST COMMUNICATION',
    artist: 'angela',
    lyricist: '永野椎菜',
    composer: '馬飼野康二',
    arranger: 'angela',
    length: 671,
  });
});

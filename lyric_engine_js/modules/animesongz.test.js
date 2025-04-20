const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./animesongz');

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
    url: 'https://animesongz.com/lyric/5145/23706',
    title: 'Realize',
    artist: '鈴木このみ',
    lyricist: '篠崎あやと 橘亮祐',
    composer: '篠崎あやと 橘亮祐',
    arranger: '篠崎あやと 橘亮祐',
    length: 525,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://animesongz.com/lyric/4515/22277',
    title: '紅蓮華',
    artist: 'lisa',
    lyricist: 'LiSA',
    composer: '草野華余子',
    arranger: '江口亮',
    length: 516,
  });
});

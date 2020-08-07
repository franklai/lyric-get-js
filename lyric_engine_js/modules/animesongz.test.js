/* global expect test */
const { Lyric } = require('./animesongz');

async function testLyric(obj) {
  const { url } = obj;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(obj.title);
  expect(inst.artist).toBe(obj.artist);
  if (obj.lyricist) expect(inst.lyricist).toBe(obj.lyricist);
  if (obj.composer) expect(inst.composer).toBe(obj.composer);
  if (obj.arranger) expect(inst.arranger).toBe(obj.arranger);
  if (obj.length) expect(inst.lyric.length).toBe(obj.length);
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

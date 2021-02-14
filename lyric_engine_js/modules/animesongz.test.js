/* global expect test */
const { Lyric } = require('./animesongz');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
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

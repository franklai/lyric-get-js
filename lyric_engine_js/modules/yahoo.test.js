/* global expect test */
const { Lyric } = require('./yahoo');

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
    url: 'http://lyrics.gyao.yahoo.co.jp/ly/Y004402/',
    title: '帰って来たヨッパライ',
    artist: 'ザ・フォーク・クルセダーズ',
    lyricist: 'ザ･フォーク･パロディ･ギャング',
    composer: '加藤和彦',
    length: 495,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://lyrics.gyao.yahoo.co.jp/ly/Y160641/',
    title: 'home',
    artist: 'クリス・ハート',
    lyricist: '多胡邦夫',
    composer: '多胡邦夫',
    length: 357,
  });
});

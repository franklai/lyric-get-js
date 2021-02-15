/* global expect test */
const { Lyric } = require('./hoick');

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
    url: 'https://hoick.jp/mdb/detail/9920/%E3%81%AB%E3%81%98',
    title: 'にじ',
    lyricist: '新沢としひこ',
    composer: '中川ひろたか',
    length: 1832,
  });
});

test('', async () => {
  await testLyric({
    url:
      'https://hoick.jp/mdb/detail/19471/%E3%83%93%E3%83%BC%E3%81%A0%E3%81%BE%E3%83%93%E3%83%BC%E3%81%99%E3%81%91%E3%81%AE%E5%A4%A7%E5%86%92%E9%99%BA',
    title: 'ビーだまビーすけの大冒険',
    lyricist: '佐藤雅彦,内野真澄',
    composer: '栗原正己',
    length: 275,
  });
});

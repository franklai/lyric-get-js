/* global expect test */
const { Lyric } = require('./lyricwiki');

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
    url: 'http://lyrics.wikia.com/%E5%9D%82%E6%9C%AC%E7%9C%9F%E7%B6%BE_(Maaya_Sakamoto):%E5%83%95%E3%81%9F%E3%81%A1%E3%81%8C%E6%81%8B%E3%82%92%E3%81%99%E3%82%8B%E7%90%86%E7%94%B1',
    title: '僕たちが恋をする理由',
    artist: 'Maaya Sakamoto',
    length: 410,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://lyrics.wikia.com/Zard:%E9%81%8B%E5%91%BD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AC%E3%83%83%E3%83%88%E5%BB%BB%E3%81%97%E3%81%A6',
    title: '運命のルーレット廻して',
    artist: 'Zard',
    length: 319,
  });
});

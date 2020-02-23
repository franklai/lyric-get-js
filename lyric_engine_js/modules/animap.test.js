/* global expect jest test */
const { Lyric } = require('./animap');

jest.setTimeout(20000); // 20 second timeout

async function testLyric(obj) {
  const { url } = obj;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(obj.title);
  expect(inst.artist).toBe(obj.artist);
  if (obj.lyricist) expect(inst.lyricist).toBe(obj.lyricist);
  if (obj.composer) expect(inst.composer).toBe(obj.composer);
  if (obj.length) expect(inst.lyric.length).toBe(obj.length);
}

test('', async () => {
  await testLyric({
    url: 'http://www.animap.jp/kasi/showkasi.php?surl=B38260',
    title: "Don't be long",
    artist: '水樹奈々',
    lyricist: '矢吹俊郎',
    composer: '矢吹俊郎',
    length: 541,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.animap.jp/kasi/showkasi.php?surl=dk130730_30',
    title: 'ViViD',
    artist: "May'n",
    lyricist: '藤林聖子',
    composer: '秋田博之',
    length: 788,
  });
});

/* global expect jest test */
const { Lyric } = require('./utamap');

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

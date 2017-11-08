/* global expect test */
const { Lyric } = require('./uta_net');

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

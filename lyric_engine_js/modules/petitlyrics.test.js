/* global expect jest test */
const { Lyric } = require('./petitlyrics');

jest.setTimeout(10000); // 10 second timeout

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
    url: 'https://petitlyrics.com/lyrics/2664469',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    lyricist: 'Hiroyuki Sawano/Tielle',
    composer: 'Hiroyuki Sawano',
    length: 985,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://petitlyrics.com/lyrics/2669211',
    title: '灰色と青(+菅田将暉)',
    artist: '米津玄師',
    lyricist: '米津玄師',
    composer: '米津玄師',
    length: 629,
  });
});

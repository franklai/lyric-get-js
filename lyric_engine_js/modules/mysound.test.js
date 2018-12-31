/* global expect test */
const { Lyric } = require('./mysound');

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
    url: 'https://mysound.jp/song/3532534/',
    title: '灰色と青 ( + 菅田将暉 )',
    artist: '米津 玄師',
    lyricist: '米津玄師',
    composer: '米津玄師',
    length: 634,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://mysound.jp/song/3319941/',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    lyricist: '澤野弘之/Tielle',
    composer: '澤野弘之',
    length: 1457,
  });
});

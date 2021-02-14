/* global expect jest test */
const { Lyric } = require('./petitlyrics');

jest.setTimeout(20000); // 20 second timeout

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (length > 0) expect(inst.lyric.length).toBe(length);
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

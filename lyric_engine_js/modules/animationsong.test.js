/* global expect test */
const { Lyric } = require('./animationsong');

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
    url: 'https://animationsong.com/archives/1803656.html',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]:Tielle & Gemie',
    lyricist: '澤野弘之・Tielle',
    composer: '澤野弘之',
    length: 1466,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://animationsong.com/archives/1804004.html',
    title: '明日の君さえいればいい。',
    artist: 'ChouCho',
    lyricist: '松井洋平',
    composer: 'yuxuki waga',
    arranger: 'yuxuki waga',
    length: 733,
  });
});

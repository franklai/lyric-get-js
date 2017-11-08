/* global expect test */
const { Lyric } = require('./animationsong');

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
    url: 'http://animationsong.com/archives/1803656.html',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]:Tielle & Gemie',
    lyricist: '澤野弘之・Tielle',
    composer: '澤野弘之',
    length: 1466,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://animationsong.com/archives/1804004.html',
    title: '明日の君さえいればいい。',
    artist: 'ChouCho',
    lyricist: '松井洋平',
    composer: 'yuxuki waga',
    arranger: 'yuxuki waga',
    length: 733,
  });
});


/* global expect test */
const { Lyric } = require('./lyrical_nonsense');

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
    url: 'https://www.lyrical-nonsense.com/lyrics/aimer/i-beg-you/#Romaji',
    title: 'I beg you',
    artist: 'Aimer',
    length: 1412,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/lyrics/minami-373/kawaki-wo-ameku/',
    title: 'カワキヲアメク',
    artist: '美波',
    lyricist: '美波',
    composer: '美波',
    length: 748,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/lyrics/kenshi-yonezu/lemon/#Espanol',
    title: 'Lemon',
    artist: '米津玄師',
    length: 1665,
  });
});

// https://www.lyrical-nonsense.com/lyrics/asca/resister/#LyricsPlus
// https://www.lyrical-nonsense.com/lyrics/kenshi-yonezu/lemon/#Espanol

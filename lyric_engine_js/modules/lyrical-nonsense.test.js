/* global expect jest test */
const { Lyric } = require('./lyrical-nonsense');

jest.setTimeout(20_000); // 20 second timeout

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url: 'https://www.lyrical-nonsense.com/global/lyrics/lisa/homura/#Romaji',
    title: 'Homura',
    artist: 'LiSA',
    lyricist: '梶浦由記・LiSA',
    composer: '梶浦由記',
    length: 1019,
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
    url: 'https://www.lyrical-nonsense.com/global/lyrics/kenshi-yonezu/lemon/#Espanol',
    title: 'Lemon',
    artist: 'Kenshi Yonezu',
    length: 1665,
  });
});

// https://www.lyrical-nonsense.com/lyrics/asca/resister/#LyricsPlus
// https://www.lyrical-nonsense.com/lyrics/kenshi-yonezu/lemon/#Espanol

/* global expect jest test */
const { Lyric } = require('./rocklyric');

jest.setTimeout(20000); // 20 second timeout

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
    url: 'https://rocklyric.jp/lyric.php?sid=172900',
    title: 'ANTHEM',
    artist: 'Royz',
    lyricist: 'Royz',
    composer: 'Royz',
    length: 659,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://rocklyric.jp/lyric.php?sid=175043',
    title: 'CASTLE OF THE NINE',
    artist: 'A9',
    lyricist: 'Show & Tora & Saga',
    composer: 'A9',
    length: 668,
  });
});

/* global expect jest test */
const { Lyric } = require('./azlyrics');
const BlockedError = require('../include/blocked-error');

jest.setTimeout(45_000); // 45 second timeout

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);

  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
  }

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url: 'https://www.azlyrics.com/lyrics/coldplay/adventureofalifetime.html',
    title: 'Adventure Of A Lifetime',
    artist: 'Coldplay',
    length: 1154,
  });
});

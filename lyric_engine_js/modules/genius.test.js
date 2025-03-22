/* global expect test */
const { Lyric } = require('./genius');
const BlockedError = require('../include/blocked-error');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, length } = object;
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
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('genius, Hollow Coves - Coastline', async () => {
  await testLyric({
    url: 'https://genius.com/Hollow-coves-coastline-lyrics',
    title: 'Coastline',
    artist: 'Hollow Coves',
    length: 1079,
  });
});

test('genius, Sakamoto Maaya- tune the rainbow', async () => {
  await testLyric({
    url: 'https://genius.com/Maaya-sakamoto-tune-the-rainbow-lyrics',
    title: '​tune the rainbow',
    artist: '坂本真綾 (Maaya Sakamoto)',
    length: 521,
  });
});

/* global expect test */
const { Lyric } = require('./awa');
const BlockedError = require('../include/blocked-error');

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
    url: 'https://s.awa.fm/track/cdaa4619fdb2fd9a1f91',
    title: '南風',
    artist: '下川 みくに',
    length: 430,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://s.awa.fm/track/b20def9499bf0b335652',
    title: 'tune the rainbow',
    artist: '坂本 真綾',
    length: 518,
  });
});

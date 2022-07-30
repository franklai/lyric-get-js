/* global expect jest test */
const { Lyric } = require('./line-music');

jest.setTimeout(20_000); // 20 second timeout

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
    if (error.code === 'ECONNRESET') {
      console.warn('Connection rest');
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

test('yorushika - spring thief', async () => {
  await testLyric({
    url: 'https://music.line.me/webapp/track/mt00000000125b0c3a',
    title: '春泥棒',
    artist: 'ヨルシカ',
  });
});

test('sakamoto maaya - tune the rainbow', async () => {
  await testLyric({
    url: 'https://music.line.me/webapp/track/mt000000000eb3d9c2',
    title: 'tune the rainbow',
    artist: '坂本 真綾',
  });
});

/* global expect test */
const { Lyric } = require('./joysound');

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
    url: 'https://www.joysound.com/web/search/song/402005',
    title: 'SAVED.',
    artist: '坂本真綾',
    lyricist: '鈴木祥子',
    composer: '鈴木祥子',
    length: 397,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.joysound.com/web/search/song/96127',
    title: 'I.D.',
    artist: '坂本真綾',
    lyricist: '坂本真綾',
    composer: '菅野よう子',
    length: 394,
  });
});

/* global expect test */
const { Lyric } = require('./nana-music');

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
    url: 'https://en.nana-music.com/songs/36697',
    title: 'tune the rainbow',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 515,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://en.nana-music.com/songs/22844',
    title: 'ペガサス幻想',
    artist: 'MAKE-UP',
    lyricist: '竜真知子',
    composer: '松澤浩明・山田信夫',
    length: 395,
  });
});

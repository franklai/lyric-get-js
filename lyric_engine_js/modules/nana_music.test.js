/* global expect jest test */
const { Lyric } = require('./nana_music');

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

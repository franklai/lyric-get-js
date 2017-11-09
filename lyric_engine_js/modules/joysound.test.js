/* global expect test */
const { Lyric } = require('./joysound');

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

/* global expect jest test */
const { Lyric } = require('./kashinavi');

jest.setTimeout(30000); // 20 second timeout

async function testLyric(obj) {
  const { url } = obj;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(obj.title);
  expect(inst.artist).toBe(obj.artist);
  if (obj.lyricist) expect(inst.lyricist).toBe(obj.lyricist);
  if (obj.composer) expect(inst.composer).toBe(obj.composer);
  if (obj.length) expect(inst.lyric.length).toBe(obj.length);
}

test('', async () => {
  await testLyric({
    url: 'http://kashinavi.com/song_view.html?65545',
    title: '猫背',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 366,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://kashinavi.com/song_view.html?77597',
    title: "We Don't Stop",
    artist: '西野カナ',
    lyricist: 'Kana Nishino・GIORGIO 13',
    composer: 'Giorgio Cancemi',
    length: 1260,
  });
});

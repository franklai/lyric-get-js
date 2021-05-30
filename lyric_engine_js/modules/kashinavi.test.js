/* global expect jest test */
const { Lyric } = require('./kashinavi');

jest.setTimeout(20_000); // 20 second timeout

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
    url: 'https://kashinavi.com/song_view.html?65545',
    title: '猫背',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 366,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://kashinavi.com/song_view.html?77597',
    title: "We Don't Stop",
    artist: '西野カナ',
    lyricist: 'Kana Nishino・GIORGIO 13',
    composer: 'Giorgio Cancemi',
    length: 1260,
  });
});

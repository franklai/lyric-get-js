/* global expect jest test */
const { Lyric } = require('./evesta');

jest.setTimeout(20000); // 20 second timeout

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
    url: 'https://lyric.evesta.jp/l7c20b7s.html',
    title: 'Gift',
    artist: '坂本真綾',
    lyricist: '岩里 祐穂',
    composer: '菅野よう子',
    length: 485,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://lyric.evesta.jp/l7c20bcs.html',
    title: '紅茶',
    artist: '坂本真綾',
    lyricist: '坂本真綾',
    composer: '菅野よう子',
    length: 413,
  });
});

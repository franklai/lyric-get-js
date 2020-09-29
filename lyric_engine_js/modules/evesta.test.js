/* global expect jest test */
const { Lyric } = require('./evesta');

jest.setTimeout(20000); // 20 second timeout

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

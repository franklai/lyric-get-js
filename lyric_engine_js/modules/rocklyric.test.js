/* global expect jest test */
const { Lyric } = require('./rocklyric');

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
    url: 'https://rocklyric.jp/lyric.php?sid=172900',
    title: 'ANTHEM',
    artist: 'Royz',
    lyricist: 'Royz',
    composer: 'Royz',
    length: 659,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://rocklyric.jp/lyric.php?sid=175043',
    title: 'CASTLE OF THE NINE',
    artist: 'A9',
    lyricist: 'Show & Tora & Saga',
    composer: 'A9',
    length: 668,
  });
});

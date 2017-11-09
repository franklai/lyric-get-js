/* global expect test */
const { Lyric } = require('./j_lyric');

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
    url: 'http://j-lyric.net/artist/a002723/l001e83.html',
    title: 'tune the rainbow',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 447,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://j-lyric.net/artist/a000673/l000bea.html',
    title: '天体観測',
    artist: 'BUMP OF CHICKEN',
    lyricist: '藤原基央',
    composer: '藤原基央',
    length: 734,
  });
});

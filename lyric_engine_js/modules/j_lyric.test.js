/* global expect test */
const { Lyric } = require('./j_lyric');

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

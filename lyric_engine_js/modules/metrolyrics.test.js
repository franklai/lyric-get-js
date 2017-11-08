/* global expect test */
const { Lyric } = require('./metrolyrics');

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
    url: 'http://www.metrolyrics.com/something-just-like-this-lyrics-coldplay.html',
    title: 'Something Just Like This',
    artist: 'Coldplay',
    length: 1681,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.metrolyrics.com/red-lyrics-taylor-swift.html',
    title: 'Red',
    artist: 'Taylor Swift',
    length: 1540,
  });
});


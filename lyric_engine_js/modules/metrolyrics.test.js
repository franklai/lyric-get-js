/* global expect test */
const { Lyric } = require('./metrolyrics');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  await inst.get();

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url:
      'http://www.metrolyrics.com/something-just-like-this-lyrics-coldplay.html',
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

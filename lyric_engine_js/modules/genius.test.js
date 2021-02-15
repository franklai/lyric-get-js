/* global expect test */
const { Lyric } = require('./genius');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, length } = object;
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
    url: 'https://www.azlyrics.com/lyrics/coldplay/adventureofalifetime.html',
    title: 'Adventure Of A Lifetime',
    artist: 'Coldplay',
    length: 1154,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.azlyrics.com/lyrics/gunsnroses/sweetchildomine.html',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    length: 1056,
  });
});

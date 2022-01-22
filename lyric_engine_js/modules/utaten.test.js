/* global expect test */
const { Lyric } = require('./utaten');

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

test('BUMP OF CHICKEN', async () => {
  await testLyric({
    url: 'https://utaten.com/lyric/jb81012024/',
    title: 'beautiful glider',
    artist: 'BUMP OF CHICKEN',
    lyricist: '藤原基央',
    composer: '藤原基央',
    length: 959,
  });
});

test('AAA', async () => {
  await testLyric({
    url: 'https://utaten.com/lyric/jb71110163/',
    title: 'Charge & Go!',
    artist: 'AAA',
    lyricist: 'Kenn Kato',
    composer: 'Tetsuya Komuro',
    length: 1256,
  });
});

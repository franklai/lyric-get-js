/* global expect test */
const { Lyric } = require('./utaten');

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
    url: 'http://utaten.com/lyric/BUMP+OF+CHICKEN/beautiful+glider/',
    title: 'beautiful glider',
    artist: 'BUMP OF CHICKEN',
    lyricist: '藤原基央',
    composer: '藤原基央',
    length: 959,
  });
});

test('AAA', async () => {
  await testLyric({
    url: 'http://utaten.com/lyric/AAA/Charge+%26++Go%21/',
    title: 'Charge & Go!',
    artist: 'AAA',
    lyricist: 'Kenn Kato',
    composer: 'TETSUYA KOMURO',
    length: 1256,
  });
});

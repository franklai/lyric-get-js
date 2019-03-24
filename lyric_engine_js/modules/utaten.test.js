/* global expect test */
const { Lyric } = require('./utaten');

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

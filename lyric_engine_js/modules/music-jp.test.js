/* global expect jest test */
const { Lyric } = require('./music-jp');

jest.setTimeout(50_000); // 50 second timeout

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
    url: 'https://music-book.jp/music/Kashi/aaa1pa8u?artistname=%25e8%2597%258d%25e4%25ba%2595%25e3%2582%25a8%25e3%2582%25a4%25e3%2583%25ab&title=INNOCENCE&packageName=INNOCENCE',
    title: 'INNOCENCE',
    artist: '藍井エイル',
    lyricist: 'Eir/Ryosuke Shigenaga',
    composer: 'Ryosuke Shigenaga',
    length: 467,
  });
});

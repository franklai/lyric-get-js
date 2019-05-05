/* global expect jest test */
const { Lyric } = require('./music_jp');

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
    url: 'http://music-book.jp/music/Kashi/aaa1fw1p?artistname=miwa&title=%25e3%2583%2592%25e3%2582%25ab%25e3%2583%25aa%25e3%2583%2598&packageName=%25e3%2583%2592%25e3%2582%25ab%25e3%2583%25aa%25e3%2583%2598',
    title: 'ヒカリヘ',
    artist: 'miwa',
    lyricist: 'miwa',
    composer: 'miwa',
    length: 634,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://music-book.jp/music/Kashi/aaa1pa8u?artistname=%25e8%2597%258d%25e4%25ba%2595%25e3%2582%25a8%25e3%2582%25a4%25e3%2583%25ab&title=INNOCENCE&packageName=INNOCENCE',
    title: 'INNOCENCE',
    artist: '藍井エイル',
    lyricist: 'Eir/Ryosuke Shigenaga',
    composer: 'Ryosuke Shigenaga',
    length: 467,
  });
});

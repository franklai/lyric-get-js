/* global expect jest test */
const { Lyric } = require('./kget');

jest.setTimeout(30_000); // 30 second timeout

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

test.skip('', async () => {
  await testLyric({
    url: 'http://www.kget.jp/lyric/188989/',
    title: 'ずっと feat.HAN-KUN & TEE',
    artist: 'SPICY CHOCOLATE, HAN-KUN, TEE',
    lyricist: 'HAN-KUN, TEE',
    composer: 'DJ CONTROLER, U.M.E.D.Y., WolfJunk',
    length: 769,
  });
});

test.skip('', async () => {
  await testLyric({
    url: 'http://www.kget.jp/lyric/185146/',
    title: 'ビースト!!',
    artist: '関ジャニ∞',
    lyricist: '錦戸亮',
    composer: '朱鷺羽ソウ',
    length: 924,
  });
});

test.skip('', async () => {
  await testLyric({
    url: 'http://www.kget.jp/lyric/11066/',
    title: 'tune the rainbow',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 520,
  });
});

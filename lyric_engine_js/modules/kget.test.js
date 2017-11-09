/* global expect jest test */
const { Lyric } = require('./kget');

jest.setTimeout(30000); // 30 second timeout

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
    url: 'http://www.kget.jp/lyric/188989/',
    title: 'ずっと feat.HAN-KUN & TEE',
    artist: 'SPICY CHOCOLATE, HAN-KUN, TEE',
    lyricist: 'HAN-KUN, TEE',
    composer: 'DJ CONTROLER, U.M.E.D.Y., WolfJunk',
    length: 769,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.kget.jp/lyric/185146/',
    title: 'ビースト!!',
    artist: '関ジャニ∞',
    lyricist: '錦戸亮',
    composer: '朱鷺羽ソウ',
    length: 924,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.kget.jp/lyric/11066/',
    title: 'tune the rainbow',
    artist: '坂本真綾',
    lyricist: '岩里祐穂',
    composer: '菅野よう子',
    length: 520,
  });
});

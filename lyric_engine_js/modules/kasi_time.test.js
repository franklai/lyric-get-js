/* global expect test */
const { Lyric } = require('./kasi_time');

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
    url: 'http://www.kasi-time.com/item-80325.html',
    title: 'RAGE OF DUST',
    artist: 'SPYAIR',
    lyricist: 'MOMIKEN',
    composer: 'UZ(SPYAIR)',
    arranger: 'UZ(SPYAIR)　Kohsuke Oshima',
    length: 402,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.kasi-time.com/item-45162.html',
    title: 'only my railgun',
    artist: 'fripSide',
    lyricist: '八木沼悟志　yuki-ka',
    composer: '八木沼悟志',
    arranger: '八木沼悟志',
    length: 845,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://www.kasi-time.com/item-73971.html',
    title: 'Animetic Love Letter',
    artist: '宮森あおい&安原絵麻&坂木しずか(cv.木村珠莉&佳村はるか&千菅春香)',
    lyricist: '桃井はるこ',
    composer: '桃井はるこ',
    arranger: '渡辺剛',
    length: 773,
  });
});

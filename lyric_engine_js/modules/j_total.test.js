/* global expect test */
const { Lyric } = require('./j_total');

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
    url: 'http://music.j-total.net/data/013su/029_sukima_switch/004.html',
    title: '奏（かなで）',
    artist: 'スキマスイッチ',
    lyricist: '常田真太郎・大橋卓弥',
    composer: '常田真太郎・大橋卓弥',
    length: 1308,
  });
});

test('', async () => {
  await testLyric({
    url: 'http://music.j-total.net/data/026ha/048_hata_motohiro/010.html',
    title: '鱗(うろこ)',
    artist: '秦基博',
    lyricist: '秦基博',
    composer: '秦基博',
    length: 1267,
  });
});

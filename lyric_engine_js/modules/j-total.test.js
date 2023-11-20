/* global expect test */
const { Lyric } = require('./j-total');

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
    url: 'https://music.j-total.net/data/013su/029_sukima_switch/004.html',
    title: '奏（かなで）',
    artist: 'スキマスイッチ',
    lyricist: '常田真太郎・大橋卓弥',
    composer: '常田真太郎・大橋卓弥',
    length: 1330,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://music.j-total.net/data/026ha/048_hata_motohiro/010.html',
    title: '鱗(うろこ)',
    artist: '秦基博',
    lyricist: '秦基博',
    composer: '秦基博',
    length: 1748,
  });
});

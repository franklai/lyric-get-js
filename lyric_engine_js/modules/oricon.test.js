/* global expect test */
const { Lyric } = require('./oricon');

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
    url: 'https://www.oricon.co.jp/prof/586696/lyrics/I235546/',
    title: '三月と群青',
    artist: '水瀬いのり',
    lyricist: '藤永龍太郎(Elements Garden)',
    composer: '藤永龍太郎(Elements Garden)',
    length: 595,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.oricon.co.jp/prof/223926/lyrics/I240064/',
    title: '結界',
    artist: '水樹奈々',
    lyricist: '松井五郎',
    composer: '光増ハジメ',
    length: 622,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://music.oricon.co.jp/php/lyrics/LyricsDisp.php?music=3969679',
    title: '運気上昇イエローパンチ',
    artist: '富井大樹(Cv.蒼井翔太)',
    lyricist: '橋口いくよ',
    composer: 'Kohei by SIMONSAYZ',
    length: 539,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://music.oricon.co.jp/php/lyrics/LyricsDisp.php?music=6618069',
    title: '紅蓮華',
    artist: 'LiSA',
    lyricist: 'LiSA',
    composer: '草野華余子',
    length: 516,
  });
});

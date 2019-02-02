/* global expect test */
const { Lyric } = require('./oricon');

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

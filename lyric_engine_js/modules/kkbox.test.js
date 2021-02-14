/* global expect test */
const { Lyric } = require('./kkbox');

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
    url: 'https://www.kkbox.com/tw/tc/song/yZdhFjM058t9XJz7TJz7T0P4-index.html',
    title: '無敵鐵金剛',
    artist: '盧廣仲 (Crowd Lu)',
    lyricist: '盧廣仲',
    composer: '盧廣仲',
    length: 370,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.kkbox.com/jp/ja/song/b0h00IP8n.YTkRIeTkRIe0XL-index.html',
    title: 'gravityWall',
    artist: 'SawanoHiroyuki[nZk]',
    lyricist: 'Hiroyuki Sawano・Tielle',
    composer: 'Hiroyuki Sawano',
    length: 1462,
  });
});

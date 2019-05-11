/* global expect jest test */
const { Lyric } = require('./mojim');

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
    url: 'https://mojim.com/jpy108109x1x3.htm',
    title: '色彩',
    artist: 'Half-Life',
    lyricist: '上里洋志・岡村健人',
    composer: 'Half-Life',
    length: 501,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://mojim.com/twy105842x18x5.htm',
    title: '紅茶',
    artist: '坂本真綾',
    lyricist: '坂本真綾',
    composer: '菅野よう子',
    length: 383,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://mojim.com/usy100012x18x2.htm',
    title: '倔強',
    artist: '五月天',
    lyricist: '阿信',
    composer: '阿信',
    arranger: '五月天',
    length: 1239,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://mojim.com/cny105713x9x1.htm',
    title: '演员',
    artist: '薛之谦',
    lyricist: '薛之谦',
    composer: '薛之谦',
    arranger: 'Andy Wang',
    length: 1583,
  });
});

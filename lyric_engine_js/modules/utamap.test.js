const { Lyric } = require('./utamap');


test('', async () => {
  const url = 'http://www.utamap.com/showkasi.php?surl=59709';
  obj = new Lyric(url);
  const a = await obj.get()

  expect(obj.title).toBe('One more time,One more chance');
  expect(obj.artist).toBe('山崎まさよし');
  expect(obj.lyricist).toBe('山崎将義');
  expect(obj.lyric.length).toBe(794);
});

test('', async () => {
  const url = 'http://www.utamap.com/showkasi.php?surl=k-131226-001';
  obj = new Lyric(url);
  const a = await obj.get()

  expect(obj.title).toBe('ちっぽけな愛のうた');
  expect(obj.artist).toBe('小枝理子&小笠原秋');
  expect(obj.lyricist).toBe('亀田誠治');
  expect(obj.composer).toBe('亀田誠治');
  expect(obj.lyric.length).toBe(572);
});

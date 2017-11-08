const { Lyric } = require('./uta_net');


test('', async () => {
  const url = 'https://www.uta-net.com/song/231884/';
  obj = new Lyric(url);
  const a = await obj.get()

  expect(obj.title).toBe('sh0ut');
  expect(obj.artist).toBe('SawanoHiroyuki[nZk]:Tielle&Gemie');
  expect(obj.lyricist).toBe('Hiroyuki Sawano・Tielle');
  expect(obj.composer).toBe('Hiroyuki Sawano');
  expect(obj.lyric.length).toBe(1881);
});

test('', async () => {
  const url = 'https://www.uta-net.com/song/237845/';
  obj = new Lyric(url);
  const a = await obj.get()

  expect(obj.title).toBe('灰色と青 ( + 菅田将暉)');
  expect(obj.artist).toBe('米津玄師');
  expect(obj.lyricist).toBe('米津玄師');
  expect(obj.composer).toBe('米津玄師');
  expect(obj.lyric.length).toBe(629);
});

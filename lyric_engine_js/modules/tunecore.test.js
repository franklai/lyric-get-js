/* global expect test */
const { Lyric } = require('./tunecore');
const BlockedError = require('../include/blocked-error');

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);

  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
  }

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url: 'https://linkco.re/ydtc1MEu/songs/1589993/lyrics',
    title: 'サイリウムの証明',
    artist: '放課後プリンセス',
    lyricist: '藤原優樹',
    composer: 'ANDW',
    length: 546,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://linkco.re/ydtc1MEu/songs/1589993/lyrics?lang=ja',
    title: 'サイリウムの証明',
    artist: '放課後プリンセス',
    lyricist: '藤原優樹',
    composer: 'ANDW',
    length: 546,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://linkco.re/ydtc1MEu/songs/1589993/lyrics?lang=en',
    title: 'Sairiumu no Syoumei',
    artist: 'houkagoprincess',
    lyricist: 'Masaki Fujiwara',
    composer: 'ANDW',
    length: 546,
  });
});

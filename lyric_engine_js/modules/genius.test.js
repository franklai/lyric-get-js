const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./genius');
const BlockedError = require('../include/blocked-error');

test('genius excludes translation menu links and preserves lyric links', () => {
  const inst = new Lyric('https://genius.com/example-lyrics');
  const html =
    '<div data-lyrics-container="true">' +
    '<ul><li><a class="TranslationLink__Anchor-sc-example link" href="/translation">' +
    '日本語 (Japanese)</a></li></ul>' +
    '<a class="ReferentFragment" href="/annotation">First line</a><br/>Second line' +
    '</div><div class="SectionLeaderboard">';

  inst.find_lyric(inst.url, html);

  assert.strictEqual(inst.lyric, 'First line\nSecond line');
});

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, length } = object;
  const inst = new Lyric(url);

  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
  }

  assert.strictEqual(inst.title, title);
  assert.strictEqual(inst.artist, artist);
  if (lyricist) assert.strictEqual(inst.lyricist, lyricist);
  if (composer) assert.strictEqual(inst.composer, composer);
  if (length > 0) assert.strictEqual(inst.lyric.length, length);
}

test('genius, Hollow Coves - Coastline', async () => {
  await testLyric({
    url: 'https://genius.com/Hollow-coves-coastline-lyrics',
    title: 'Coastline',
    artist: 'Hollow Coves',
    length: 1078,
  });
});

test('genius, Sakamoto Maaya- tune the rainbow', async () => {
  await testLyric({
    url: 'https://genius.com/Maaya-sakamoto-tune-the-rainbow-lyrics',
    title: 'tune the rainbow',
    artist: '坂本真綾 (Maaya Sakamoto)',
    length: 520,
  });
});

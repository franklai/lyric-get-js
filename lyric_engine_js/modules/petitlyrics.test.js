const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./petitlyrics');
const BlockedError = require('../include/blocked-error');

async function testLyric(object, t) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new Lyric(url);
  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      t.skip('Blocked by vendor');
      return;
    }
    throw error;
  }

  assert.strictEqual(inst.title, title);
  assert.strictEqual(inst.artist, artist);
  if (lyricist) assert.strictEqual(inst.lyricist, lyricist);
  if (composer) assert.strictEqual(inst.composer, composer);
  if (arranger) assert.strictEqual(inst.arranger, arranger);
  if (length > 0) assert.strictEqual(inst.lyric.length, length);
}

test('petitlyrics skips blocked requests', async (t) => {
  t.mock.method(Lyric.prototype, 'get', async () => {
    throw new BlockedError('petitlyrics shows 403');
  });
  let reason;
  await testLyric(
    { url: 'https://petitlyrics.com/lyrics/2664469' },
    {
      skip: (message) => {
        reason = message;
      },
    }
  );
  assert.strictEqual(reason, 'Blocked by vendor');
});

test('petitlyrics preserves unexpected errors', async (t) => {
  const error = new Error('Unexpected response');
  t.mock.method(Lyric.prototype, 'get', async () => {
    throw error;
  });
  await assert.rejects(
    testLyric({ url: 'https://petitlyrics.com/lyrics/2664469' }, t),
    (actual) => actual === error
  );
});

test('gravityWall', async (t) => {
  await testLyric(
    {
      url: 'https://petitlyrics.com/lyrics/2664469',
      title: 'gravityWall',
      artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
      lyricist: 'Hiroyuki Sawano/Tielle',
      composer: 'Hiroyuki Sawano',
      length: 985,
    },
    t
  );
});

test('灰色と青(+菅田将暉)', async (t) => {
  await testLyric(
    {
      url: 'https://petitlyrics.com/lyrics/2669211',
      title: '灰色と青(+菅田将暉)',
      artist: '米津玄師',
      lyricist: '米津玄師',
      composer: '米津玄師',
      length: 629,
    },
    t
  );
});

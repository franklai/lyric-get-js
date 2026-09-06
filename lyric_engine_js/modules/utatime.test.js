const assert = require('node:assert');
const test = require('node:test');
const { Lyric } = require('./utatime');
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

for (const status of [403, 503]) {
  test(`utatime converts HTTP ${status} to BlockedError and skips blocked requests`, async (t) => {
    const url = 'https://www.utatime.com/lyrics/example/';
    t.mock.method(Lyric.prototype, 'get_html', async () => {
      throw Object.assign(new Error('fetch response is not ok'), { status });
    });
    await assert.rejects(new Lyric(url).get(), BlockedError);
    let reason;
    await testLyric(
      { url },
      {
        skip: (message) => {
          reason = message;
        },
      }
    );
    assert.strictEqual(reason, 'Blocked by vendor');
  });
}

test('utatime preserves unexpected request errors', async (t) => {
  const error = Object.assign(new Error('Server error'), { status: 500 });
  t.mock.method(Lyric.prototype, 'get_html', async () => {
    throw error;
  });
  await assert.rejects(
    testLyric({ url: 'https://www.utatime.com/lyrics/example/' }, t),
    (actual) => actual === error
  );
});

test('utatime, LiSA - Homura', async (t) => {
  await testLyric(
    {
      url: 'https://www.utatime.com/global/lyrics/lisa/homura/#Romaji',
      title: 'Homura',
      artist: 'LiSA',
      lyricist: 'Yuki Kajiura・LiSA',
      composer: 'Yuki Kajiura',
      length: 1019,
    },
    t
  );
});

test('utatime, 美波 - カワキヲアメク', async (t) => {
  await testLyric(
    {
      url: 'https://www.utatime.com/lyrics/minami-373/kawaki-wo-ameku/',
      title: 'カワキヲアメク',
      artist: '美波',
      lyricist: '美波',
      composer: '美波',
      length: 748,
    },
    t
  );
});

test('utatime, Kenshi Yonezu - Lemon', async (t) => {
  await testLyric(
    {
      url: 'https://www.utatime.com/global/lyrics/kenshi-yonezu/lemon/#Espanol',
      title: 'Lemon',
      artist: 'Kenshi Yonezu',
      length: 1665,
    },
    t
  );
});

test('utatime, Yorushika - Sunny', async (t) => {
  await testLyric(
    {
      url: 'https://www.utatime.com/global/lyrics/yorushika/haru/',
      title: 'Sunny',
      artist: 'Yorushika',
      lyricist: 'n-buna',
      composer: 'n-buna',
      length: 1033,
    },
    t
  );
});

// https://www.utatime.com/lyrics/asca/resister/#LyricsPlus
// https://www.utatime.com/global/lyrics/kenshi-yonezu/lemon/#Espanol

const engine = require('../../../../lyric_engine_js');

// eslint-disable-next-line import/prefer-default-export
export async function onRequestGet({ params }) {
  const { url } = params;
  const out = {
    lyric: `Failed to find lyric of ${url}`,
  };
  try {
    const lyric = await engine.get_full(url);
    out.lyric = lyric;
  } catch (error) {
    console.log(`something wrong, error: ${error}`);
  }

  // eslint-disable-next-line no-undef
  return new Response(JSON.stringify(out));
}

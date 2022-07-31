// const engine = require('../../../../lyric_engine_js');
// eslint-disable-next-line global-require
const sites = [require('../../../../lyric_engine_js/modules/azlyrics')];

// eslint-disable-next-line import/prefer-default-export
export async function onRequestGet({ params }) {
  const { url } = params;
  const out = {
    lyric: `Failed to find lyric of ${url}`,
  };

  console.log(`url: ${url}`);

  try {
    const site = sites.find((item) => url.includes(item.keyword));

    const object = new site.Lyric(url);
    if (!(await object.parse_page())) {
      throw new Error('Parse failed.');
    }

    const lyric = object.get_full();
    out.lyric = lyric;
  } catch (error) {
    console.log(`something wrong, error: ${error}`);
  }

  // eslint-disable-next-line no-undef
  return new Response(JSON.stringify(out));
}

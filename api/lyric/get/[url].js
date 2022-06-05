const engine = require('../../../lyric_engine_js');

module.exports = async (request, response) => {
  const { url } = request.query;
  const out = {
    lyric: `Failed to find lyric of ${url}`,
  };
  try {
    const lyric = await engine.get_full(url);
    out.lyric = lyric;
  } catch (error) {
    console.log(`something wrong, error: ${error}`);
  }

  response.send(JSON.stringify(out));
};

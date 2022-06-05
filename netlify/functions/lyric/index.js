const Sentry = require('@sentry/node');

const engine = require('../../../lyric_engine_js');
const LyricBase = require('../../../lyric_engine_js/include/lyric-base');

exports.handler = async (event, context) => {
  console.log(`dir name of netlify function: ${__dirname}`);
  console.log(`my user agent ${LyricBase.USER_AGENT}`);

  const { url } = event.queryStringParameters;
  const out = {
    lyric: `Failed to find lyric of ${url}`,
  };

  try {
    const lyric = await engine.get_full(url);
    out.lyric = lyric;
  } catch (error) {
    console.log(`something wrong, error: ${error}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(out),
  };
};

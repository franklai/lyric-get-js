const util = require('util');
const rp = require('request-promise');
const XML = require('pixl-xml');

const LyricBase = require('../include/lyric_base');

const keyword = 'yahoo';

class Lyric extends LyricBase {
  async find_lyric(url, xml) {
    const doc = XML.parse(xml);

    let lyric = doc.Result.Lyrics;
    lyric = lyric.replace(/<br>/g, '\n');

    this.lyric = lyric;

    return true;
  }

  async find_info(url, xml) {
    const doc = XML.parse(xml);

    const patterns = {
      title: 'Title',
      artist: 'ArtistName',
      lyricist: 'WriterName',
      composer: 'ComposerName',
    };
    Object.keys(patterns).forEach((key) => {
      const key_for_pattern = patterns[key];
      this[key] = doc.Result[key_for_pattern];
    });
  }

  async get_xml_parameters(url) {
    const xml = await rp(url);

    const pattern = "query +: +'([^']+)'";
    return this.get_first_group_by_pattern(xml, pattern);
  }

  async get_xml(query) {
    const url = util.format(
      'http://rio.yahooapis.jp/RioWebService/V2/getLyrics?appid=%s&%s',
      '7vOgnk6xg64IDggn6YEl3IQxmbj1qqkQzTpAx5nGwl9HnfPX3tZksE.oYhEw3zA-', query
    );

    const xml = await rp(url);

    if (!xml) {
      return false;
    }

    return xml;
  }

  async parse_page() {
    const { url } = this;

    let query = await this.get_xml_parameters(url);
    if (query === false) {
      console.warn('Failed to get query of url:', url);
      return false;
    }
    query = decodeURIComponent(query);

    const xml = await this.get_xml(query);

    await this.find_lyric(url, xml);
    await this.find_info(url, xml);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://gyao.yahoo.co.jp/lyrics/ly/Y217740/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

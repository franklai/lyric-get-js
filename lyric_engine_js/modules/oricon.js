const he = require('he');
const iconv = require('iconv-lite');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'oricon';

class Lyric extends LyricBase {
  get_json_lds(html) {
    const prefix = '<script type="application/ld+json">';
    const suffix = '</script>';
    const json_lds = [];
    const first_json_ld = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    json_lds.push(first_json_ld);

    const pos = html.indexOf(first_json_ld);
    const after_first = html.substring(pos + first_json_ld.length);

    json_lds.push(this.find_string_by_prefix_suffix(after_first, prefix, suffix, false));

    return json_lds.map(JSON.parse);
  }

  find_lyric(url, html) {
    const prefix = '<div class="all-lyrics"';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!lyric) {
      const prefix_lyric_contents = '<div class="lyric-contents"';
      lyric = this.find_string_by_prefix_suffix(html, prefix_lyric_contents, suffix);
    }

    lyric = lyric.replace(/<br>/g, '\n');
    lyric = striptags(he.decode(lyric)).trim();

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const [first_json, second_json] = this.get_json_lds(html);

    this.title = first_json.name;
    this.lyricist = first_json.lyricist[0].name;
    this.composer = first_json.composer[0].name;

    this.artist = second_json.name;
  }

  async parse_page() {
    const { url } = this;

    const raw = await rp({ url, encoding: null });
    const html = iconv.decode(raw, 'Shift_JIS');
    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://www.oricon.co.jp/prof/586696/lyrics/I235546/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

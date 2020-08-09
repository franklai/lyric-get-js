const LyricBase = require('../include/lyric_base');

const keyword = 'kkbox';

class Lyric extends LyricBase {
  get_json_ld(html) {
    const prefix = "<script type='application/ld+json'>";
    const suffix = '</script>';

    const json_ld = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );
    return JSON.parse(json_ld);
  }

  find_lyric(url, html) {
    const json_ld = this.get_json_ld(html);

    let lyric = json_ld.recordingOf.lyrics.text;
    lyric = lyric.trim();

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const json_ld = this.get_json_ld(html);

    this.title = json_ld.name;
    this.artist = json_ld.byArtist.name;
    this.lyricist = json_ld.recordingOf.lyricist.name;
    this.composer = json_ld.recordingOf.composer.name;
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url);
    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url =
      'https://www.kkbox.com/tw/tc/song/XgJ00.nUO65u2jgdu2jgd0XL-index.html';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

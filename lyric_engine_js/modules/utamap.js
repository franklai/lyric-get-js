const tls = require('tls');
const util = require('util');

const LyricBase = require('../include/lyric_base');

const keyword = 'utamap';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = 'kasi_honbun">';
    const suffix = '<!-- 歌詞 end -->';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    lyric = lyric.replace(/<br>/g, '\n');
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const keys = {
      title: 'title',
      artist: 'artist',
      lyricist: 'sakusi',
      composer: 'sakyoku',
    };

    const patterns = {};
    Object.keys(keys).forEach((key) => {
      const input_name = keys[key];
      patterns[key] = new RegExp(
        util.format('<INPUT type="hidden" name=%s value="([^"]*)">', input_name)
      );
    });

    this.fill_song_info(html, patterns);
  }

  async parse_page() {
    const { url } = this;

    // due to utamap only supports TLS 1.0
    tls.DEFAULT_MIN_VERSION = 'TLSv1';
    // set encoding to null, to let response is Buffer, not String
    const html = await this.get_html(url, { encoding: 'eucjp' });

    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://www.utamap.com/showkasi.php?surl=70380';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

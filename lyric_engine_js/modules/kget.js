const LyricBase = require('../include/lyric_base');

const keyword = 'kget';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div id="lyric-trunk">';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const pattern = '<h1.*?>(.*)</h1>';
    const value = this.get_first_group_by_pattern(html, pattern);
    if (value) {
      this.title = this.sanitize_html(value);
    } else {
      console.warn('Failed to parse title of url:', url);
      return false;
    }

    const prefix = '<table class="lyric-data">';
    const suffix = '</table>';
    const table_str = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );

    const patterns = {
      artist: '">([^<]*)</a></span></td></tr>',
      lyricist: '>作詞</th><td>([^<]*)<br></td></tr>',
      composer: '>作曲</th><td>([^<]*)<br></td></tr>',
    };

    this.fill_song_info(table_str, patterns);

    return true;
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
    const url = 'http://www.kget.jp/lyric/11066/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

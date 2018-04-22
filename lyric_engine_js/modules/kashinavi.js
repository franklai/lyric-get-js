const iconv = require('iconv-lite');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'kashinavi';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /\?([0-9]+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url, html) {
    const prefix = '<p oncopy="return false;" unselectable="on;">';
    const suffix = '</p>';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replace(/<br>/g, '\n').replace(/<br \/><br \/>\n/g, '\n\n');
    lyric = striptags(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const prefix = '<table border=0 cellpadding=0 cellspacing=5>';
    const suffix = '<hr noshade size=1>';
    const table_str = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: '<td><h2>([^<]+?)</h2></td>',
      artist: '<td><h2><a href="[^"]+">(.+?)</a></h2></td>',
      lyricist: '作詞　：　([^<]+)<br>',
      composer: '作曲　：　([^<]+)</td>',
    };

    this.fill_song_info(table_str, patterns);
  }

  async get_html(url) {
    const raw = await rp({ url, encoding: null });
    const html = iconv.decode(raw, 'Shift_JIS');

    return html;
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url);

    this.find_lyric(url, html);
    this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'http://kashinavi.com/song_view.html?77597';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

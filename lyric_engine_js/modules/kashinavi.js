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
    const prefix = 'oncopy="return false;" unselectable="on;">';
    const suffix = '</p>';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replace(/<br>　<br>/g, '\n\n');
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = striptags(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const prefix = '<td valign=top align=center width=550>';
    const suffix = '<hr noshade size=1>';
    const table_str = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: '<div align=center><h1>([^<]+?)[♪<]',
      artist: '<a href="[^"]+">(.+?)</a>',
      lyricist: '作詞　：　([^<]+)<br>',
      composer: '作曲　：　([^<]+)</.+>',
    };

    this.fill_song_info(table_str, patterns);
  }

  async parse_page() {
    const { url } = this;

    const raw = await this.get_html(url, null);
    const html = iconv.decode(raw, 'sjis')

    this.find_lyric(url, html);
    this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://kashinavi.com/song_view.html?77597';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

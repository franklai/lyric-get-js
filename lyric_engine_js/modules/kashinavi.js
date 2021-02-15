const LyricBase = require('../include/lyric-base');

const keyword = 'kashinavi';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /\?(\d+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url, html) {
    const prefix = 'oncopy="return false;" unselectable="on;">';
    const suffix = '</div>';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replace(/<\/p><p>/g, '\n\n');
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const prefix = '<td valign=top align=center width=550>';
    const suffix = '<hr ';
    const table_string = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );

    const patterns = {
      title: '<div align=center><h.>([^<]+?)[♪<]',
      artist: '<a href="[^"]+".*?>(.+?)</a>',
      lyricist: '作詞\\s*：\\s*(.+)<br>',
      composer: '作曲\\s*：\\s*(.+)</.+>',
    };

    this.fill_song_info(table_string, patterns);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });

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
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

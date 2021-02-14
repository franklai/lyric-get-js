const LyricBase = require('../include/lyric-base');

const keyword = 'rocklyric';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<p oncontextmenu=';
    const suffix = '</p>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
    lyric = lyric.replace(/\n/g, '').replace(/\r/g, '').replace(/<br>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const prefix = '<div id="artist_info">';
    const suffix = '</h3>';
    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    const block = raw.replace(/\n/g, '').replace(/\t/g, '');
    const patterns = {
      title: '<h1>(.+?)</h1>',
      artist: '<h2><a href =".*?"><font.*?>(.+?)</font>',
      lyricist: 'word:.*?>(.+?)</a>',
      composer: 'music:.*?>(.+?)</a>',
    };

    this.fill_song_info(block, patterns);
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
    const url = 'https://rocklyric.jp/lyric.php?sid=175043';
    // const url = 'https://rocklyric.jp/lyric.php?sid=172900';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

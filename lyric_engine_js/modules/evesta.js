const LyricBase = require('../include/lyric_base');

const keyword = 'evesta';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div id="lyricbody">';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const patterns = {
      title: '<h1>(.*) 歌詞</h1>',
      artist: '<p>歌：<a href.*?>([^<]*)</a></p>',
      lyricist: '<p class="small">作詞：([^<]*)</p>',
      composer: '<p class="small">作曲：([^<]*)</p>',
    };

    this.fill_song_info(html, patterns);
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
    const url = 'http://lyric.evesta.jp/l7d0a18.html';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

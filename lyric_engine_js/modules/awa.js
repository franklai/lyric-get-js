const LyricBase = require('../include/lyric-base');

const keyword = 'awa.fm';

class Lyric extends LyricBase {
  find_lyric(url, html) {
    const prefix = '歌詞</h2><p class=';
    const suffix = '</p>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    lyric = lyric.replace('歌詞</h2>', '');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: '<h1 class=.*?>(.*?)</h1>',
      artist: '</span><a class=.*?>(.*?)</a></p>',
    };

    this.fill_song_info(html, patterns);
    return true;
  }

  async parse_page() {
    let { url } = this;

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
    const url = 'https://s.awa.fm/track/cdaa4619fdb2fd9a1f91';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

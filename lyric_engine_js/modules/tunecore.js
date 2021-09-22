const LyricBase = require('../include/lyric-base');
const BlockedError = require('../include/blocked-error');

const keyword = 'linkco.re';

class Lyric extends LyricBase {
  find_lyric(url, html) {
    const prefix = '<div class=lyric_text';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    lyric = lyric.replace(/<p>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: '<div class=header_text>.*?<h2>(.*?)</h2>',
      artist: '<div class=header_text>.*?<h3>(.*?)</h3>',
      lyricist: '<div class=lyric_credit>.*?<p>([^<]*?)</ul>',
      composer: '<div class=lyric_credit>.*?<p>([^<]*?)<li>',
    };

    this.fill_song_info(html, patterns);
    return true;
  }

  async parse_page() {
    const { url } = this;

    try {
      const html = await this.get_html(url);
      this.find_lyric(url, html);
      this.find_info(url, html);
    } catch (error) {
      if (error.status === 403) {
        throw new BlockedError('tunecore shows 403');
      }
    }

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://linkco.re/5ZuherRZ/songs/1343847/lyrics?lang=ja';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

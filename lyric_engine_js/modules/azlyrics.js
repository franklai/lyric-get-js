const LyricBase = require('../include/lyric-base');

const keyword = 'azlyrics';

class Lyric extends LyricBase {
  find_lyric(url, html) {
    const prefix = '<!-- Usage of azlyrics.com content';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: 'SongName = "(.*?)"',
      artist: 'ArtistName = "(.*?)"',
    };

    this.fill_song_info(html, patterns);
    return true;
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
    const url = 'https://www.azlyrics.com/lyrics/coldplay/upup.html';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}
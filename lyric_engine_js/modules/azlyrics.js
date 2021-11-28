const LyricBase = require('../include/lyric-base');
const BlockedError = require('../include/blocked-error');

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

    if (!this.title) {
      console.error('Failed to find title');
      console.error(url);
      console.error(html);
    }
    return true;
  }

  is_blocked(html) {
    const pattern = 'recaptcha/api.js';
    return html && html.includes(pattern);
  }

  async parse_page() {
    const { url } = this;

    try {
      let html = await this.get_html(url);
      if (this.is_blocked(html)) {
        // try using proxy
        html = await this.get_html_by_proxy(url);

        if (this.is_blocked(html)) {
          throw new BlockedError('AZLyrics shows recaptcha');
        }
      }

      this.find_lyric(url, html);
      this.find_info(url, html);
    } catch (error) {
      if (error.status === 403) {
        throw new BlockedError('AZLyrics shows 403');
      }
      throw error;
    }

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

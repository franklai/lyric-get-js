const LyricBase = require('../include/lyric_base');

const keyword = 'musixmatch';

class Lyric extends LyricBase {
  find_lyric(url, json) {
    try {
      const { body } = json.page.lyrics.lyrics;
      this.lyric = body;
    } catch (err) {
      console.error('json does not have lyrics body');
      return false;
    }

    return true;
  }

  find_info(url, json) {
    try {
      const { track } = json.page;
      this.title = track.name;
      this.artist = track.artistName;
    } catch (err) {
      return false;
    }

    return true;
  }

  find_json(html) {
    const prefix = 'var __mxmState = ';
    const suffix = ';</script>';

    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    if (!raw) {
      return false;
    }

    return JSON.parse(raw);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url);
    const json = this.find_json(html);
    this.find_lyric(url, json);
    this.find_info(url, json);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url =
      'https://www.musixmatch.com/lyrics/Shawn-Mendes/There-s-Nothing-Holdin-Me-Back';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

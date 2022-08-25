const LyricBase = require('../include/lyric-base');

const keyword = 'kashinavi';

class Lyric extends LyricBase {
  find_json_ld(html) {
    const prefix = '"@type": "MusicComposition",';
    const suffix = '</script>';

    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    const json_ld = JSON.parse(`{${raw}`);
    return json_ld;
  }

  find_song_id(url) {
    const pattern = /\?(\d+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url, html) {
    const prefix = 'oncopy="return false;" unselectable="on;">';
    const suffix = '</div>';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replace(/<br>　<br>/g, '<br><br>'); // eslint-disable-line no-irregular-whitespace
    lyric = lyric.replace(/<\/p><p>/g, '\n\n');
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(json_ld) {
    this.title = this.sanitize_html(json_ld.name);
    this.artist = this.sanitize_html(json_ld.recordedAs.byArtist.name);
    this.lyricist = this.sanitize_html(json_ld.lyricist.name);
    this.composer = this.sanitize_html(json_ld.composer.name);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });
    const json_ld = this.find_json_ld(html);

    this.find_lyric(url, html);
    this.find_info(json_ld);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://kashinavi.com/song_view.html?65545';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

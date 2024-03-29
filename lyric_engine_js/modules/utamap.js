const LyricBase = require('../include/lyric-base');

const keyword = 'utamap';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = 'kasi_honbun">';
    const suffix = '<!-- 歌詞 end -->';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    lyric = lyric.replaceAll('<br>', '\n');
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const keys = {
      title: 'title',
      artist: 'artist',
      lyricist: 'sakusi',
      composer: 'sakyoku',
    };

    const patterns = {};
    for (const key of Object.keys(keys)) {
      const input_name = keys[key];
      patterns[key] = new RegExp(
        `<INPUT type="hidden" name=${input_name} value="([^"]*)">`
      );
    }

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
    const url = 'https://www.utamap.com/showkasi.php?surl=70380';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

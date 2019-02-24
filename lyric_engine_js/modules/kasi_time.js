const he = require('he');
const rp = require('request-promise');

const LyricBase = require('../include/lyric_base');

const keyword = 'kasi-time';

class Lyric extends LyricBase {
  find_lyric(html) {
    const prefix = "var lyrics = '";
    const suffix = "';";

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = he.decode(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  find_info(html) {
    const pattern = '<h1>(.*)</h1>';
    const value = this.get_first_group_by_pattern(html, pattern);
    if (value) {
      this.title = value.trim();
    } else {
      console.error('Failed to find title of url', this.url);
      return false;
    }

    const prefix = '<div class="person_list">';
    const suffix = '</div>';
    let info_table = this.find_string_by_prefix_suffix(html, prefix, suffix);
    info_table = info_table.replace(/[\n\t]/g, '');

    const patterns = {
      artist: '<th>歌手</th>(.*?)(</td>|関連リンク)',
      lyricist: '<th>作詞</th>(.*?)</td>',
      composer: '<th>作曲</th>(.*?)</td>',
      arranger: '<th>編曲</th>(.*?)</td>',
    };

    this.fill_song_info(info_table, patterns);

    return true;
  }

  async parse_page() {
    const html = await this.get_html(this.url);
    this.find_lyric(html);
    this.find_info(html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'http://www.kasi-time.com/item-64395.html';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

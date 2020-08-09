const LyricBase = require('../include/lyric_base');

const keyword = 'j-total';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<!--HPSTART-->';
    const suffix = '<!--HPEND-->';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    if (!lyric) {
      console.error('Failed to find lyric of url:', url);
      return false;
    }

    lyric = lyric.replace(/ {4} +/g, '');
    lyric = lyric.replace(/\r/g, '');
    lyric = lyric.replace(/\n/g, '');
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  find_info_in_table(html) {
    const prefix = '<font size="4" color="#FFFFFF">';
    const suffix = '<tr bgcolor="#CCCCCC">';

    const info_str = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!info_str) {
      return false;
    }

    const patterns = {
      title: ' color="#FFFFFF"><b>(.*?)</b></font>',
      artist: '歌：(.*?)/',
      lyricist: '詞：(.*?)/',
      composer: '曲：(.*?)<',
    };

    this.fill_song_info(info_str, patterns);

    return true;
  }

  find_info_in_box2(html) {
    const prefix = '<div class="box2">';
    const suffix = '</div>';

    const info_str = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!info_str) {
      return false;
    }

    const patterns = {
      title: '<h1>(.+?)</h1>',
      artist: '歌：(.*?)/',
      lyricist: '詞：(.*?)/',
      composer: '曲：(.*?)<',
    };

    this.fill_song_info(info_str, patterns);

    return true;
  }

  async find_info(url, html) {
    if (this.find_info_in_table(html)) {
      return true;
    }
    if (this.find_info_in_box2(html)) {
      return true;
    }
    return false;
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });

    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'http://music.j-total.net/data/003u/003_utada_hikaru/004.html';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

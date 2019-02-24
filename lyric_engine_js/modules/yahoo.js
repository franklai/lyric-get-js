const util = require('util');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'yahoo';

class Lyric extends LyricBase {
  find_lyric(url, html) {
    const pattern = '<div class="lyrics-texts">(.+?)</div>';

    let lyric = this.get_first_group_by_pattern(html, pattern);
    lyric = lyric.replace(/<\/p>/g, '\n');
    lyric = lyric.replace(/<br>/g, '\n');
    lyric = striptags(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  find_info(url, html) {
    const prefix = '<h1';
    const suffix = '</dl>';
    const info_str = this.find_string_by_prefix_suffix(html, prefix, suffix);

    const patterns = {
      title: '<h1 class="lyrics-title">(.+?)</h1>',
      artist: '>([^>]+?)</a></h2>',
      lyricist: '作詞</dt><dd[^>]*>(.+?)</dd>',
      composer: '作曲</dt><dd.*?>(.+?)</dd>',
    };

    this.fill_song_info(info_str, patterns);
  }

  async get_html(url) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2141.0 Safari/537.36',
    };
    const html = await rp({
      method: 'GET',
      uri: url,
      headers,
    });
    return html;
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
    const url = 'https://gyao.yahoo.co.jp/lyrics/Y004402';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

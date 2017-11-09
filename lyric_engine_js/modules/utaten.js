const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'utaten';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div class="lyricBody">';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const pattern = /<span class="rt">(.*?)<\/span>/g;
    lyric = lyric.replace(pattern, '($1)');

    lyric = he.decode(lyric);
    lyric = striptags(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    let prefix = '<meta property="og:site_name"';
    let suffix = '<meta property="og:image"';
    let content = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    let patterns = {
      title: '<meta property="og:title" content="(.*?)　歌詞【',
      artist: '<meta property="og:description" content="(.*?)が歌う',
    };

    this.fill_song_info(content, patterns);

    prefix = '<dl class="lyricWork">';
    suffix = '</dl>';
    content = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    patterns = {
      lyricist: '作詞</dt>(.*?)</dd>',
      composer: '作曲</dt>(.*?)</dd>',
    };

    content = content.replace(/\n/g, '');
    this.fill_song_info(content, patterns);
  }

  async parse_page() {
    const { url } = this;

    const html = await rp(url);

    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'http://utaten.com/lyric/%E5%AE%89%E5%AE%A4%E5%A5%88%E7%BE%8E%E6%81%B5%26VERBAL/lovin%27+it/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

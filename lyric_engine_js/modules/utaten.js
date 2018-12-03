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
    if (!lyric) {
      return false;
    }

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
    if (!content) {
      console.error(`Failed to find info of url: ${url}`);
      return false;
    }

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
    const url = 'https://utaten.com/lyric/Daisy%C3%97Daisy/%E3%82%A4%E3%83%84%E3%83%A2%E3%82%AD%E3%83%9F%E3%83%88/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

const LyricBase = require('../include/lyric-base');

const keyword = 'utaten';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div class="hiragana" >';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!lyric) {
      console.error(`Failed to find lyric block of url: ${url}`);
      return false;
    }

    const pattern = /<span class="rt">(.*?)<\/span>/g;
    lyric = lyric.replaceAll(pattern, '($1)');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    let prefix = '<meta property="og:site_name"';
    let suffix = '<meta property="og:image"';
    let content = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );
    let patterns = {
      title: '<meta property="og:title" content="(.*?) 歌詞',
    };

    this.fill_song_info(content, patterns);

    prefix = '<dl class="newLyricWork">';
    suffix = '</dl>';
    content = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    if (!content) {
      console.error(`Failed to find info of url: ${url}`);
      return false;
    }

    patterns = {
      artist: '<h3>(.*?)</h3>',
      lyricist: '作詞</dt>(.*?)</dd>',
      composer: '作曲</dt>(.*?)</dd>',
    };

    content = content.replaceAll('\n', '');
    this.fill_song_info(content, patterns);

    return true;
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
    const url = 'http://utaten.com/lyric/jb81012024/';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

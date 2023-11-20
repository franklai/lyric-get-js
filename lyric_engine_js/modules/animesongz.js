const LyricBase = require('../include/lyric-base');

const keyword = 'animesongz';

class Lyric extends LyricBase {
  find_lyric(url, html) {
    const prefix = '<div id="lyricViewArea">';
    const suffix = '<div style=';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!lyric) {
      return false;
    }

    lyric = lyric.replaceAll(/[\n\r]/g, '');
    lyric = lyric.replaceAll(
      /<div class="roma" style="display: none;.*?<\/div>/g,
      ''
    );
    lyric = lyric.replaceAll(/<h2.*?h2>/g, '');
    lyric = lyric.replaceAll(/\t+/g, '');
    lyric = lyric.replaceAll('<div class="kana"></div>', '');
    lyric = lyric.replaceAll('<br>', '\n\n');
    lyric = lyric.replaceAll('</div><div', '</div>\n<div');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const prefix = '<div id="detail_right">';
    const suffix = '<!-- #detail_right -->';
    const block = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );
    if (!block) {
      return;
    }
    const patterns = {
      title: '<h1 class="songName">(.*?) 歌詞',
      artist: '<div class="singers">(.*?)</div>',
      lyricist: '<p>作詞：(.*?)</p>',
      composer: '<p>作曲：(.*?)</p>',
      arranger: '<p>編曲者：(.*?)</p>',
    };
    const line = block.replaceAll(/[\n\r]/g, '').replaceAll(/\t+/g, ' ');
    this.fill_song_info(line, patterns);
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
    const url = 'https://animesongz.com/lyric/5145/23706';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

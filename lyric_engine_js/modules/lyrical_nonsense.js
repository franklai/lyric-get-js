const rp = require('request-promise');

const LyricBase = require('../include/lyric_base');

const keyword = 'lyrical-nonsense';

class Lyric extends LyricBase {
  get_json_lds(html) {
    const prefix = '<script type="application/ld+json">';
    const suffix = '</script>';
    const json_lds = [];
    const first_json_ld = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    json_lds.push(first_json_ld);

    const pos = html.indexOf(first_json_ld);
    const after_first = html.substring(pos + first_json_ld.length);

    json_lds.push(this.find_string_by_prefix_suffix(after_first, prefix, suffix, false));

    return json_lds.map(JSON.parse);
  }

  get_hash(url) {
    const my_url = new URL(url);
    if (my_url.hash[0] === '#') {
      return my_url.hash.substring(1);
    }
    return '';
  }

  get_lyric_content_block(url, html) {
    const hash = this.get_hash(url) || 'Lyrics';

    const prefix = `<div class="contents" id="${hash}">`;
    const suffix = '</p>\n</div>';

    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  find_lyric(url, html) {
    const block = this.get_lyric_content_block(url, html);
    const prefix = '<div class="olyrictext">';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(block, prefix, suffix);
    if (!lyric) {
      return false;
    }

    lyric = lyric.replace(/<\/p>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: '"name" : "(.*?) 歌詞"',
      artist: '<th>歌手:</th><td>(.*?)</td>',
      lyricist: '<th>作詞:</th><td>(.*?)</td>',
      composer: '<th>作曲:</th><td>(.*?)</td>',
    };

    this.fill_song_info(html, patterns);

    // some page does not have 曲名、歌手
    if (!this.title) {
      const pattern = { title: '<h1>(.*?)</h1>' };
      this.fill_song_info(html, pattern);
    }
    if (!this.artist) {
      const pattern = { artist: '<div class="artistcontainer">(.*?)</h2>' };
      this.fill_song_info(html, pattern);
    }
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
    const url = 'https://www.lyrical-nonsense.com/lyrics/minami-373/kawaki-wo-ameku/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

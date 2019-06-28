const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'nana-music';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div class="lyric__section__contents-main"';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
    lyric = striptags(lyric);
    lyric = lyric.trim();
    this.lyric = lyric;

    return true;
  }

  async find_info(url, html) {
    const prefix = '<div class="lyric__section__contents-heading"';
    const suffix = '<div class="lyric__section__contents-main"';
    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: '<h1 class="lyric-song-title".*?>(.+?)</h1>',
      artist: '<h2 class="lyric-song-artist".*?>(.+?)</h2>',
      lyricist: '<div class="lyricist-name".*?>(.+?)</div>',
      composer: '<div class="composer-name".*?>(.+?)</div>',
    };

    this.fill_song_info(raw, patterns);

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
    const url = 'https://en.nana-music.com/songs/36697';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

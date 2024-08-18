const LyricBase = require('../include/lyric-base');

const keyword = 'nana-music';

class Lyric extends LyricBase {
  async find_lyric(url, html) {
    const prefix = '<div class="lyric__section__contents-main"';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
    lyric = this.sanitize_html(lyric);
    this.lyric = lyric;

    return true;
  }

  async find_info(url, html) {
    const prefix = '<div class="lyric__section__contents-heading"';
    const suffix = '<div class="lyric__section__contents-main"';
    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: String.raw`<\w+ class="lyric-song-title".*?>(.+?)</`,
      artist: String.raw`<\w+ class="lyric-song-artist".*?>(.+?)</`,
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
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

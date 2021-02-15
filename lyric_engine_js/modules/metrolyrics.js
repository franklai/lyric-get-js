const LyricBase = require('../include/lyric-base');

const keyword = 'metrolyrics';

class Lyric extends LyricBase {
  remove_noise(lyric) {
    const items = [
      [
        '<div id="mid-song-discussion"',
        '<span class="label">See all</span>\n</a>\n</div>',
      ],
      ['<p class="writers">', '</sd-lyricbody>'],
      ['\n<!--WIDGET - RELATED-->', '<!-- Second Section -->\n'],
      ['\n<!--WIDGET - PHOTOS-->', '<!-- Third Section -->\n'],
    ];

    let output = lyric;
    for (const [prefix, suffix] of items) {
      const noise = this.find_string_by_prefix_suffix(lyric, prefix, suffix);
      if (noise) {
        output = output.replace(noise, '');
      }
    }

    return output;
  }

  async find_lyric(url, html) {
    const prefix = '<div class="lyrics-body">';
    const suffix = '</sd-lyricbody>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!lyric) {
      console.error('Failed to find lyric of url:', url);
      return false;
    }

    lyric = this.remove_noise(lyric);

    lyric = lyric.replace(/<br \/>/g, '\n');
    lyric = lyric.replace(/<p class='verse'>/g, '\n\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const patterns = {
      title: '"musicSongTitle":"(.*?)"',
      artist: '"musicArtistName":"(.*?)"',
    };

    this.fill_song_info(html, patterns);
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
    const url = 'https://www.metrolyrics.com/clocks-lyrics-coldplay.html';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

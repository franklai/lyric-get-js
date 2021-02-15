const LyricBase = require('../include/lyric-base');

const keyword = 'genius';

class Lyric extends LyricBase {
  get_by_div_lyrics(html) {
    const prefix = '<div class="lyrics">';
    const suffix = '</div>';

    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  get_by_lyrics_root(html) {
    const prefix = ' Lyrics__Root';
    const suffix = '<div class="SectionLeaderboard';

    let body = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (body) {
      // remove prefix and suffix
      body = body.replace(new RegExp(`${prefix}.*?>`, 'g'), '');
      body = body.replace(new RegExp(suffix, 'g'), '');

      // add newline for ad block
      body = body.replace(
        new RegExp('<div class="SidebarAd__Container', 'g'),
        '<br/><div class="'
      );
    }
    return body;
  }
  find_lyric(url, html) {
    let body = this.get_by_div_lyrics(html);
    if (!body) {
      console.log('Failed to get content from .lyrics, try Lyrics__Root');
      body = this.get_by_lyrics_root(html);
    }

    body = body.replace(new RegExp('<br/>', 'g'), '\n');
    let lyric = this.sanitize_html(body);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: '<meta content=".*? – (.*?)" property="twitter:title" />',
      artist: '<meta content="(.*?) – .*?" property="twitter:title" />',
    };

    this.fill_song_info(html, patterns);
    return true;
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
    const url = 'https://genius.com/Guns-n-roses-sweet-child-o-mine-lyrics';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

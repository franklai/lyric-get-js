const LyricBase = require('../include/lyric-base');

const keyword = 'oricon';

class Lyric extends LyricBase {
  get_json_lds(html) {
    const prefix = '<script type="application/ld+json">';
    const suffix = '</script>';
    const json_lds = [];
    const first_json_ld = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      false
    );
    json_lds.push(first_json_ld);

    const pos = html.indexOf(first_json_ld);
    const after_first = html.slice(Math.max(0, pos + first_json_ld.length));

    json_lds.push(
      this.find_string_by_prefix_suffix(after_first, prefix, suffix, false)
    );

    return json_lds.map((value) => JSON.parse(value));
  }

  get_artist_name(html) {
    const pattern = /<div class="headline3"><a href=".*?ArtistTop.php\?artist=.+?">(.+?)<\/a>/;
    return this.get_first_group_by_pattern(html, pattern);
  }

  find_lyric(url, html) {
    const prefix = '<div class="all-lyrics"';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (!lyric) {
      const prefix_lyric_contents = '<div class="lyric-contents"';
      lyric = this.find_string_by_prefix_suffix(
        html,
        prefix_lyric_contents,
        suffix
      );
    }

    lyric = lyric.replace(/<br>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const [first_json, second_json] = this.get_json_lds(html);

    this.title = first_json.name;
    if (Array.isArray(first_json.lyricist)) {
      this.lyricist = first_json.lyricist[0].name;
    } else if (first_json.lyricist.name) {
      this.lyricist = first_json.lyricist.name;
    }
    if (Array.isArray(first_json.composer)) {
      this.composer = first_json.composer[0].name;
    } else if (first_json.composer.name) {
      this.composer = first_json.composer.name;
    }

    if (second_json.name) {
      this.artist = second_json.name;
    } else {
      this.artist = this.get_artist_name(html);
    }
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });
    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://www.oricon.co.jp/prof/586696/lyrics/I235546/';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

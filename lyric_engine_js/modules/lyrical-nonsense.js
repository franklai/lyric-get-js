const LyricBase = require('../include/lyric-base');

const keyword = 'lyrical-nonsense';

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

  get_hash(url) {
    const my_url = new URL(url);
    if (my_url.hash[0] === '#') {
      return my_url.hash.slice(1);
    }
    return '';
  }

  get_lyric_content_block(url, html) {
    const hash = this.get_hash(url) || 'Lyrics';

    let prefix = `<div class="contents" id="${hash}">`;
    const suffix = '</p><br/></div>';

    const block = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (block) {
      return block;
    }

    prefix = `<div class="contents subcontents" id="${hash}">`;

    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  find_lyric(url, html) {
    const oneLine = html.replace(/[\n\r]/g, '');

    const block = this.get_lyric_content_block(url, oneLine);
    if (!block) {
      console.error(`Failed to get content block of url ${url}`);
      return false;
    }
    const prefix = '<div class="olyrictext">';
    const suffix = '</div>';

    let lyric = this.find_string_by_prefix_suffix(block, prefix, suffix);
    if (!lyric) {
      return false;
    }

    lyric = lyric.replace(/<\/p>/g, '\n');
    lyric = lyric.replace(/<br\/> ?/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const prefix = '"@type": "MusicComposition",';
    const suffix = '"Lyrics" : {';

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
      title: '"name" : "(.+?)",',
      artist: '"byArtist".*?"name" : "(.+?)",',
      lyricist: '"lyricist".*?"name" : "(.*?)"',
      composer: '"composer".*?"name" : "(.*?)"',
    };

    const line = block.replace(/[\n\r]/g, '');
    this.fill_song_info(line, patterns);

    // composer and lyricist may be empty in LD JSON
    if (!this.lyricist) {
      const pattern = { lyricist: '<dt>作詞：</dt><dd>(.*?)</dd>' };
      this.fill_song_info(html, pattern);
    }
    if (!this.composer) {
      const pattern = { composer: '<dt>作曲：</dt><dd>(.*?)</dd>' };
      this.fill_song_info(html, pattern);
    }
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
    let url =
      'https://www.lyrical-nonsense.com/lyrics/minami-373/kawaki-wo-ameku/';
    if (process.argv.length > 2) {
      // eslint-disable-next-line prefer-destructuring
      url = process.argv[2];
    }
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

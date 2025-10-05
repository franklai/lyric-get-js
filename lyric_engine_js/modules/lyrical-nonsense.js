const LyricBase = require('../include/lyric-base');
const BlockedError = require('../include/blocked-error');

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

  get_content_id(url) {
    const my_url = new URL(url);

    const is_global = my_url.pathname.startsWith('/global/');
    const content_id =
      my_url.hash[0] === '#'
        ? my_url.hash.slice(1)
        : is_global
          ? 'Romaji'
          : 'Original';

    return [content_id, is_global];
  }

  get_lyric_content_block(url, html) {
    const [content_id, is_global] = this.get_content_id(url);

    let prefix = `<div class="contents subcontents" id="${content_id}">`;
    let suffix = '<div class="ln-row-cont">';
    if (content_id === 'Romaji') {
      prefix = `<div class="contents" id="${content_id}">`;
      suffix = '<style>';
    } else if (content_id === 'Original') {
      prefix = `<div class="contents" id="${content_id}">`;
      suffix = is_global
        ? '<br/></div><div class="ln-row-cont">'
        : '</div><div class="ln-row-cont">';
    }

    console.warn(`== get block ==`);
    console.warn(`== url: ${url}, content id: ${content_id}, is global: ${is_global} ==`);
    
    const block = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (block) {
      console.warn(`== found block ==`);
      console.warn(block);

      return block;
    }

    console.warn(`== NOT found block ==`);
    console.warn(html);

    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  find_lyric(url, html) {
    const oneLine = html.replaceAll(/[\n\r]/g, '').replaceAll(/> +</g, '><');

    const block = this.get_lyric_content_block(url, oneLine);
    if (!block) {
      console.error(`Failed to get content block of url ${url}`);
      return false;
    }
    let lyric = block;

    lyric = lyric.replaceAll(/<script>.+?<\/script>/g, '');
    lyric = lyric.replaceAll(/<dl class="titledetails">.+?<\/dl>/g, '');
    lyric = lyric.replaceAll(/<div id="amplified_.+?<\/div>/g, '');
    lyric = lyric.replaceAll(/<span class="line-number">\d+\.<\/span>/g, '');
    lyric = lyric.replaceAll('<span class="line-text">', '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const prefix = '"@type": "MusicComposition",';
    const suffix = '"Lyrics" :';

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

    const line = block.replaceAll(/[\n\r]/g, '');
    this.fill_song_info(line, patterns);

    // composer and lyricist may be empty in LD JSON
    if (!this.lyricist) {
      const info = this.find_string_by_prefix_suffix(
        html,
        '<th>作詞：</th>',
        '</td>',
        false
      );
      this.lyricist = this.sanitize_html(info);
    }
    if (!this.lyricist) {
      const info = this.find_string_by_prefix_suffix(
        html,
        '<th>Lyricist:</th>',
        '</td>',
        false
      );
      this.lyricist = this.sanitize_html(info);
    }

    if (!this.composer) {
      const info = this.find_string_by_prefix_suffix(
        html,
        '<th>作曲：</th>',
        '</td>',
        false
      );
      this.composer = this.sanitize_html(info);
    }
    if (!this.composer) {
      const info = this.find_string_by_prefix_suffix(
        html,
        '<th>Composer:</th>',
        '</td>',
        false
      );
      this.composer = this.sanitize_html(info);
    }
  }

  async parse_page() {
    const { url } = this;

    try {
      const html = await this.get_html(url);
      await this.find_lyric(url, html);
      await this.find_info(url, html);
    } catch (error) {
      if (error.status === 503) {
        throw new BlockedError('lyrical-nonsense is blocked');
      }
      console.error(error);
    }

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
      url = process.argv[2];
    }
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

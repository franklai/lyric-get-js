const LyricBase = require('../include/lyric-base');
const BlockedError = require('../include/blocked-error');

const keyword = 'utatime';

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
    const [content_id] = this.get_content_id(url);
    const pattern = new RegExp(
      `<div class="contents(?: subcontents)?" id="${content_id}">([\\s\\S]*?)(?=<div class="contents(?: subcontents)?" id=|<div class="creditlyricblock|$)`
    );
    return this.get_first_group_by_pattern(html, pattern);
  }

  find_lyric(url, html) {
    const oneLine = html.replaceAll(/[\n\r]/g, '').replaceAll(/> +</g, '><');

    const block = this.get_lyric_content_block(url, oneLine);
    if (!block) {
      console.error(`Failed to get content block of url ${url}`);
      return false;
    }
    const lines = [...block.matchAll(/<span class="line-text">([\s\S]*?)<\/span>/g)].map(
      (match) => this.sanitize_html(match[1])
    );
    while (lines[0] === '') lines.shift();
    while (lines.at(-1) === '') lines.pop();

    const lyric = lines.join('\n');
    if (!lyric) {
      console.error(`Failed to find lyric lines of url ${url}`);
      return false;
    }

    this.lyric = lyric;

    return true;
  }

  find_info(html) {
    const scripts = html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );
    for (const match of scripts) {
      const data = JSON.parse(match[1]);
      const graph = data['@graph'] || [data];
      const page = graph.find(
        (item) => item.mainEntity?.['@type'] === 'MusicComposition'
      );
      if (!page) continue;

      const composition = page.mainEntity;
      this.title = composition.name;
      this.artist = composition.recordedAs?.byArtist?.name;
      break;
    }

    this.lyricist = this.find_credit(html, ['作詞：', 'Lyricist:']);
    this.composer = this.find_credit(html, ['作曲：', 'Composer:']);
  }

  find_credit(html, labels) {
    for (const label of labels) {
      const pattern = new RegExp(
        `<th>${label}</th>\\s*<td>([\\s\\S]*?)</td>`
      );
      const value = this.get_first_group_by_pattern(html, pattern);
      if (value) {
        return this.sanitize_html(value.replace(/<br\s*\/?>/gi, '・'));
      }
    }
    return undefined;
  }

  async parse_page() {
    const { url } = this;

    try {
      const html = await this.get_html(url, { impersonate: 'chrome' });
      await this.find_lyric(url, html);
      await this.find_info(html);
    } catch (error) {
      if (error.status === 503) {
        throw new BlockedError('utatime is blocked');
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
      'https://www.utatime.com/lyrics/minami-373/kawaki-wo-ameku/';
    if (process.argv.length > 2) {
      url = process.argv[2];
    }
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

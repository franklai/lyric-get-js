const LyricBase = require('../include/lyric-base');

const keyword = 'music-book.jp';

class Lyric extends LyricBase {
  get_nuxt_script(html) {
    const prefix = 'window.__NUXT__=';
    const suffix = '</script>';
    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  find_list(content, prefix, suffix) {
    const value = this.find_string_by_prefix_suffix(
      content,
      prefix,
      suffix,
      false
    );
    if (!value) {
      return [];
    }
    return value.split(',');
  }

  get_parameters(script) {
    const keys = this.find_list(script, 'function(', ')');
    const values = this.find_list(script, '}}(', ')');
    const parameters = Object.fromEntries(
      keys.map((_, index) => [keys[index], JSON.parse(values[index])])
    );
    return parameters;
  }

  get_mapping(script) {
    const patterns = {
      artist: /artist:(.+?),/,
      title: /id:".*?",title:(.+?),artist:/,
      package: /packageName:(.+?),/,
    };
    const mapping = {};
    for (const [key, pattern] of Object.entries(patterns)) {
      mapping[key] = this.get_first_group_by_pattern(script, pattern);
    }
    return mapping;
  }

  async get_basic_info(url, html) {
    const nuxt_script = this.get_nuxt_script(html);

    const parameters = this.get_parameters(nuxt_script);
    const mapping = this.get_mapping(nuxt_script);

    for (const [key, value] of Object.entries(mapping)) {
      if (value.length === 1) {
        mapping[key] = parameters[value];
      } else {
        mapping[key] = JSON.parse(value);
      }
    }

    return mapping;
  }

  async get_song_json(info) {
    const url_parameters = new URLSearchParams({
      trackTitle: info.title,
      artistName: info.artist,
      packageName: info.package,
    });

    const lyric_url = `https://music-book.jp/music/Lyrics/Track?${url_parameters.toString()}`;
    const json = await this.get_html(lyric_url);

    return JSON.parse(json);
  }

  async find_lyric(url, json) {
    const lyric = json.lyrics.join('\n');

    this.lyric = lyric;
    return true;
  }

  async find_info(url, json, info) {
    this.artist = info.artist;

    this.title = json.title;
    this.lyricist = json.writer;
    this.composer = json.composer;
  }

  async parse_page() {
    const { url } = this;

    let html;
    try {
      html = await this.get_html(url);
    } catch (error) {
      if (
        error.response &&
        error.response.body &&
        error.response.body.includes('メンテナンス')
      ) {
        this.lyric = '只今メンテナンス中です';
        return true;
      }
      console.error(error);
      return false;
    }

    const info = await this.get_basic_info(url, html);

    const json = await this.get_song_json(info);

    await this.find_lyric(url, json);
    await this.find_info(url, json, info);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://music-book.jp/music/Artist/461542/Music/aaa9lset';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

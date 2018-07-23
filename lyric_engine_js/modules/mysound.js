const striptags = require('striptags');
const superagent = require('superagent');

const LyricBase = require('../include/lyric_base');

const keyword = 'mysound';

class Lyric extends LyricBase {
  find_id(url, html) {
    const pattern = /id="song_id" value="([0-9]+)/;
    return this.get_first_group_by_pattern(html, pattern);
  }

  async find_lyric(url, html) {
    const id = this.find_id(url, html);

    const lyric_url = `https://mysound.jp/song/lyric/${id}/`;
    const json = (await superagent.get(lyric_url)).body;

    let lyric = json.lyricData;
    lyric = lyric.replace(/<dl>.*?<\/dl>/, '');
    lyric = lyric.replace(/<br \/>/g, '\n');
    lyric = striptags(lyric).trim();

    this.lyric = lyric;

    return true;
  }

  async find_info(url, html) {
    const prefix = '<div class="textBox">';
    const suffix = '</div>';
    const og_desc = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: '<dt class="title.*?">(.*?)</dt>',
      artist: '<dd class="artist.*?">(.*?)</dd>',
      lyricist: '<dd class="lyrics">作詞：(.*?)</dd>',
      composer: '<dd class="composer">作曲：(.*?)</dd>',
    };

    this.fill_song_info(og_desc, patterns);
  }

  async parse_page() {
    const { url } = this;

    const html = (await superagent.get(url)).text;
    await this.find_lyric(url, html);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://mysound.jp/song/65051/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

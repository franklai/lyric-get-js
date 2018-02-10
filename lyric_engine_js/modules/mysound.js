const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'mysound';

class Lyric extends LyricBase {
  find_id(url) {
    const pattern = '/song/([0-9]+)/';
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url) {
    const id = this.find_id(url);

    const lyric_url = `https://mysound.jp/song/lyric/${id}/`;
    const json = await rp({ uri: lyric_url, json: true });

    let lyric = json.lyricData;
    lyric = lyric.replace(/<dl>.*?<\/dl>/, '');
    lyric = lyric.replace(/<br \/>/g, '\n');
    lyric = striptags(lyric).trim();

    this.lyric = lyric;

    return true;
  }

  async find_info(url) {
    const html = await rp(url);

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

    await this.find_lyric(url);
    await this.find_info(url);

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

const rp = require('request-promise');

const LyricBase = require('../include/lyric_base');

const keyword = 'hoick';

class Lyric extends LyricBase {
  find_id(url) {
    const pattern = '/detail/([0-9]+)/';
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url) {
    const id = this.find_id(url);

    const lyric_url = `https://hoick.jp/data.php?id=${id}&type=4`;
    const lines = await rp({ uri: lyric_url, json: true });

    lines.pop(); // last one is a number

    const lyric = lines.join('\n').replace(/\r/g, '');

    this.lyric = lyric;

    return true;
  }

  async find_info(url) {
    const html = await rp(url);

    const prefix = '<meta property="og:description"';
    const suffix = '/>';
    const og_desc = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

    const patterns = {
      title: 'content="(.*?)\\(詞:',
      lyricist: '作詞：(.*?)/作曲：',
      composer: '作曲：(.*?)\\)"',
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
    const url = 'http://hoick.jp/mdb/detail/9920/%E3%81%AB%E3%81%98';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

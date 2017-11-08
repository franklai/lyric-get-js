const iconv = require('iconv-lite');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');

const keyword = 'uta-net';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /[a-z]+\/([0-9]+)/;
    const result = pattern.exec(url);

    return result ? result[1] : null;
  }

  async find_lyric(url) {
    const song_id = this.find_song_id(url);

    if (!song_id) {
      console.warn('Failed to get song id of url:', url);
      return false;
    }

    const song_url = `http://www.uta-net.com/user/phplib/svg/showkasi.php?ID=${song_id}`;
    const raw = await rp(song_url);
    if (!raw) {
      console.warn('Failed to get content of url:', song_url);
      return false;
    }

    const prefix = '<svg ';
    const suffix = '</svg>';
    let lyric = this.find_string_by_prefix_suffix(raw, prefix, suffix, true);
    if (!lyric) {
      console.warn('Failed to find lyric');
      return false;
    }

    lyric = lyric.replace(/<\/text>/g, '\n');
    lyric = striptags(lyric);
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url) {
    // set encoding to null, to let response is Buffer, not String
    const raw = await rp({ url, encoding: null });
    const html = iconv.decode(raw, 'utf8');

    const patterns = {
      title: '<h2[^>]*>([^<]+)</h2>',
      artist: '歌手：<h3.*?><a href="/artist/[0-9]+/".*?>(.+?)</a></h3>',
      lyricist: '作詞：<h4.*?>([^<]+)</h4>',
      composer: '作曲：<h4.*?>([^<]+)</h4>',
    };

    this.fill_song_info(html, patterns);
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
    const url = 'https://www.uta-net.com/song/216847/';
    const obj = new Lyric(url);
    const lyric = await obj.get();
    console.log(lyric);
  })();
}

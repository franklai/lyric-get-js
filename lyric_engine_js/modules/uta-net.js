const LyricBase = require('../include/lyric-base');

const keyword = 'uta-net';

class Lyric extends LyricBase {
  find_lyric(html) {
    let lyric = this.get_first_group_by_pattern(
      html,
      '<div[^>]+id=["\\\']kashi_area["\\\'][^>]*>([\\s\\S]*?)</div>'
    );
    if (!lyric) {
      console.warn('Failed to find lyric');
      return false;
    }

    lyric = lyric.replace(/<br\s*\/?>/gi, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  find_info(html) {
    const patterns = {
      title: '<h2[^>]*>([^<]+)</h2>',
      artist: '<a href="/artist/[0-9]+/".*?itemprop="byArtist".*?>(.+?)</a>',
      lyricist: '作詞：<a.*?itemprop="lyricist".*?>(.+?)</a>',
      composer: '作曲：<a.*?itemprop="composer".*?>(.+?)</a>',
      arranger: '編曲：<a.*?itemprop="arranger".*?>(.+?)</a>',
    };

    this.fill_song_info(html, patterns);
  }

  async parse_page() {
    const html = await this.get_html(this.url, { impersonate: 'firefox' });

    this.find_lyric(html);
    this.find_info(html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://www.uta-net.com/song/216847/';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

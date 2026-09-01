const LyricBase = require('../include/lyric-base');

const keyword = 'kashinavi';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /\?(\d+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  find_lyric(html) {
    let lyric = this.get_first_group_by_pattern(
      html,
      '<div[^>]+class=["\\\'][^"\\\']*kashi-japanese-block[^"\\\']*["\\\'][^>]*>([\\s\\S]*?)</div>'
    );
    if (!lyric) {
      throw new Error('Failed to find lyric');
    }

    lyric = lyric.replace(/<br\s*\/?>/gi, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  find_info(html) {
    const patterns = {
      title:
        '"@type"\\s*:\\s*"MusicRecording"[\\s\\S]*?"name"\\s*:\\s*"([^"]+)"',
      artist: '"byArtist"\\s*:\\s*\\{[\\s\\S]*?"name"\\s*:\\s*"([^"]+)"',
      lyricist: '"lyricist"\\s*:\\s*\\{[\\s\\S]*?"name"\\s*:\\s*"([^"]+)"',
      composer: '"composer"\\s*:\\s*\\{[\\s\\S]*?"name"\\s*:\\s*"([^"]+)"',
    };

    this.fill_song_info(html, patterns);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });

    this.find_lyric(html);
    this.find_info(html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://kashinavi.com/song_view.html?65545';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

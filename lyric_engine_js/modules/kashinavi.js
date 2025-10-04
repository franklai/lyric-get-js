const LyricBase = require('../include/lyric-base');

const keyword = 'kashinavi';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /\?(\d+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url, html) {
    const prefix = 'oncopy="return false;" unselectable="on;">';
    const suffix = '</div>';
    let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    lyric = lyric.replaceAll('<br>\u3000<br>', '<br><br>');
    lyric = lyric.replaceAll('</p><p>', '\n\n');
    lyric = lyric.replaceAll('<br>', '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  find_title(html) {
    const prefix = '"MusicRecording"';
    const suffix = '"byArtist"';

    const block = this.find_string_by_prefix_suffix(html, prefix, suffix);

    const patterns = {
      title: '"name": "(.+)"',
    };

    this.fill_song_info(block, patterns);
  }

  async find_info(url, html) {
    this.find_title(html);

    const prefix = '<td valign=top align=center';
    const suffix = '</div></div>';

    const info_block = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      true
    );

    const patterns = {
      artist: '歌手：<a.*?>(.+?)<',
      lyricist: String.raw`作詞\s*：\s*(.+)<br>`,
      composer: String.raw`作曲\s*：\s*(.+)\n`,
    };

    this.fill_song_info(info_block, patterns);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.get_html(url, { encoding: 'sjis' });

    this.find_lyric(url, html);
    this.find_info(url, html);

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

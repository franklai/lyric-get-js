const Sentry = require('@sentry/node');

const LyricBase = require('../include/lyric-base');

const keyword = 'mojim';

class Lyric extends LyricBase {
  get_lang(url) {
    const pattern = /com\/([a-z]{2})y/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  filter_ad(lyric) {
    const separator = '<br />';
    const lines = lyric.split(separator);
    const filtered = lines.filter((line) => !line.includes('Mojim.com'));
    return filtered.join(separator);
  }

  filter_thank(lyric) {
    const pattern = /<ol>.*?<\/ol>/;
    return lyric.replace(pattern, '');
  }

  async find_lyric(url, html) {
    const prefix = "<dt id='fsZx2'";
    const suffix = '</dl>';
    const lyricPrefix = '<br /><br />';

    const block = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
    let lyric = this.find_string_by_prefix_suffix(
      block,
      lyricPrefix,
      suffix,
      false
    );
    lyric = this.filter_ad(lyric);
    lyric = this.filter_thank(lyric);
    lyric = lyric.replace(/<br \/>/g, '\n');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url, html) {
    const prefix = "<dl id='fsZx1'";
    const suffix = '</dl>';
    const block = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      true
    ).replace(/\n/g, '');

    Sentry.withScope((scope) => {
      scope.setLevel('info');
      scope.setExtra(block);
      Sentry.captureMessage('Mojim.com info block');
    });

    const keys = {
      lyricist: '作詞',
      composer: '作曲',
      arranger: '編曲',
    };

    const lang = this.get_lang(url);
    if (lang === 'cn') {
      keys.lyricist = '作词';
      keys.arranger = '编曲';
    } else if (lang === 'us') {
      keys.lyricist = 'Lyricist';
      keys.composer = 'Composer';
      keys.arranger = 'Arranger';
    }

    const patterns = {
      title: "<dt id='fsZx2'.*?>(.+?)<br",
      artist: "<dl id='fsZx1'.*?>(.+?)<br",
      lyricist: `${keys.lyricist}：(.+?)<br`,
      composer: `${keys.composer}：(.+?)<br`,
      arranger: `${keys.arranger}：(.+?)<br`,
    };

    this.fill_song_info(block, patterns);
  }

  async parse_page() {
    let { url } = this;

    if (url.startsWith('https://')) {
      url = url.replace(/^https:/, 'http:');
    }

    const html = await this.get_html(url);

    this.find_lyric(url, html);
    this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://mojim.com/twy105842x18x5.htm';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

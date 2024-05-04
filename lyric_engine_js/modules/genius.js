const LyricBase = require('../include/lyric-base');
const BlockedError = require('../include/blocked-error');

const keyword = 'genius';

class Lyric extends LyricBase {
  get_by_div_lyrics(html) {
    const prefix = '<div class="lyrics">';
    const suffix = '</div>';

    return this.find_string_by_prefix_suffix(html, prefix, suffix);
  }

  get_by_lyrics_root(html) {
    const prefix = '<div data-lyrics-container="true"';
    const suffix = '<div class="SectionLeaderboard';

    let body = this.find_string_by_prefix_suffix(html, prefix, suffix);
    if (body) {
      // remove prefix and suffix
      body = body.replaceAll(new RegExp(`${prefix}.*?>`, 'g'), '');
      body = body.replaceAll(new RegExp(suffix, 'g'), '');

      // add newline for ad block
      body = body.replaceAll(
        '<div class="SidebarAd__Container',
        '<br/><div class="'
      );
    }
    return body;
  }

  find_lyric(url, html) {
    let body = this.get_by_lyrics_root(html);
    if (!body) {
      console.log('Failed to get content from .lyrics, try class="lyrics"');
      body = this.get_by_div_lyrics(html);
    }

    let lyric = body;
    lyric = lyric.replace(
      /<div class="PrimisPlayer/,
      '<br/><div class="PrimisPlayer'
    );
    lyric = lyric.replaceAll('<br/>', '\n');
    lyric = lyric.replaceAll(/<button.*?<\/button>/g, '');
    lyric = lyric.replaceAll(/<label.*?<\/label>/g, '');
    lyric = lyric.replaceAll(/<div class="EmbedForm__Copy.*?<\/div>/g, '');
    lyric = lyric.replaceAll(/<div class="ShareButtons.*?<\/div>/g, '');
    lyric = lyric.replaceAll(
      /<div class="LyricsEditExplainer__.*?<\/div>/g,
      ''
    );
    lyric = lyric.replaceAll(/<div class="RecommendedSongs__.*?<\/div>/g, '');
    lyric = lyric.replaceAll(/<div class="StubhubLink__.*?<\/div>/g, '');
    lyric = lyric.replaceAll(/<h2.*?<\/h2>/g, '');
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const patterns = {
      title: '<meta content=".*? – (.*?)" property="twitter:title" />',
      artist: '<meta content="(.*?) – .*?" property="twitter:title" />',
    };

    this.fill_song_info(html, patterns);
    return true;
  }

  async parse_page() {
    const { url } = this;

    let html;
    try {
      html = await this.get_html(url);
    } catch (error) {
      if (error.status === 403) {
        throw new BlockedError('genius is blocked');
      }
    }

    this.find_lyric(url, html);
    this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://genius.com/Hollow-coves-coastline-lyrics';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

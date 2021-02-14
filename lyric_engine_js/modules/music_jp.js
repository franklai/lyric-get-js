const URL = require('url');

const LyricBase = require('../include/lyric-base');

const keyword = 'music-book.jp';

class Lyric extends LyricBase {
  get_artist_id(html) {
    const pattern = "checkFavorite\\('([0-9]+)'\\)";
    const id = this.get_first_group_by_pattern(html, pattern);
    return id;
  }

  async get_song_json(url, html) {
    const artist_id = this.get_artist_id(html);
    if (!artist_id) {
      console.error('Failed to get artist id of url:', url);
      return false;
    }

    const url_object = URL.parse(url, true);

    const pos = url_object.pathname.lastIndexOf('/');
    const pid = url_object.pathname.slice(pos + 1);

    const post_url = 'https://music-book.jp/music/MusicDetail/GetLyric';
    const body = {
      artistId: artist_id,
      artistName: decodeURIComponent(url_object.query.artistname),
      title: url_object.query.title,
      muid: '',
      pid,
      packageName: decodeURIComponent(url_object.query.packageName),
    };

    const json = await this.post_form(post_url, body);

    return json;
  }

  async find_lyric(url, json) {
    let lyric = json.Lyrics;

    lyric = lyric.replace(/<br \/>/g, '\n');
    lyric = lyric.trim();

    this.lyric = lyric;
    return true;
  }

  async find_info(url, json) {
    const url_object = URL.parse(url, true);

    this.title = decodeURIComponent(url_object.query.title);
    this.artist = decodeURIComponent(url_object.query.artistname);
    this.lyricist = json.Writer;
    this.composer = json.Composer;
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

    const json = await this.get_song_json(url, html);

    await this.find_lyric(url, json);
    await this.find_info(url, json);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url =
      'https://music-book.jp/music/Kashi/aaa6rh9s?artistname=%25e5%2580%2589%25e6%259c%25a8%25e9%25ba%25bb%25e8%25a1%25a3&title=%25e6%25b8%25a1%25e6%259c%2588%25e6%25a9%258b%2520%25ef%25bd%259e%25e5%2590%259b%2520%25e6%2583%25b3%25e3%2581%25b5%25ef%25bd%259e&packageName=%25e6%25b8%25a1%25e6%259c%2588%25e6%25a9%258b%2520%25ef%25bd%259e%25e5%2590%259b%2520%25e6%2583%25b3%25e3%2581%25b5%25ef%25bd%259e';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

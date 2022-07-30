const LyricBase = require('../include/lyric-base');

const keyword = 'music.line.me';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = 'track/(mt[0-9a-z]+)';
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url) {
    const song_id = this.find_song_id(url);

    const json_url = `https://music.line.me/api2/track/${song_id}/lyrics.v1`;
    const raw = await this.get_html(json_url);
    const j = JSON.parse(raw);

    let lyric = j.response.result.lyric.lyric;

    this.lyric = lyric;

    return true;
  }

  async find_info(url) {
    const song_id = this.find_song_id(url);

    const json_url = `https://music.line.me/api2/tracks/${song_id}.v1`;
    const raw = await this.get_html(json_url);
    const j = JSON.parse(raw);

    const track = j.response.result.tracks[0];

    this.title = track.trackTitle;
    this.artist = track.artists[0].artistName;
  }

  async parse_page() {
    const { url } = this;

    try {
      await this.find_lyric(url);
      await this.find_info(url);
    } catch (error) {
      if (error.code === 'ECONNRESET') {
        throw error;
      }
    }

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://music.line.me/webapp/track/mt00000000125b0c3a';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

const LyricBase = require('../include/lyric-base');

const keyword = 'joysound';

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = '/song/([0-9]+)';
    return this.get_first_group_by_pattern(url, pattern);
  }

  async get_song_json(id) {
    const json_url = 'https://mspxy.joysound.com/Common/Lyric';
    const headers = {
      'X-JSP-APP-NAME': '0000800',
    };
    const body = {
      kind: 'naviGroupId',
      selSongNo: id,
      interactionFlg: '0',
      apiVer: '1.0',
    };

    const json = await this.post_form(json_url, new URLSearchParams(body), {
      headers,
    });

    return json;
  }

  async find_lyric(url, json) {
    if (!json || !json.lyricList || json.lyricList.length !== 1) {
      return false;
    }

    let { lyric } = json.lyricList[0];
    lyric = lyric.trim();

    this.lyric = lyric;

    return true;
  }

  async find_info(url, json) {
    const patterns = {
      title: 'songName',
      artist: 'artistName',
      lyricist: 'lyricist',
      composer: 'composer',
    };

    for (const key of Object.keys(patterns)) {
      const key_for_pattern = patterns[key];

      const value = json[key_for_pattern];

      this[key] = value;
    }
  }

  async parse_page() {
    const { url } = this;

    const id = this.find_song_id(url);
    const json = await this.get_song_json(id);

    await this.find_lyric(url, json);
    await this.find_info(url, json);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://www.joysound.com/web/search/song/21599';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

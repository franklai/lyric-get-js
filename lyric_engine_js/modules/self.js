const LyricBase = require('../include/lyric-base');

const keyword = 'franks543-lyric-get';

const info_url = 'https://franks543-lyric-get.azurewebsites.net/info';

class Lyric extends LyricBase {
  find_lyric(url, json) {
    this.lyric = JSON.stringify(json);

    return true;
  }

  find_info(url, json) {
    this.title = `info ${json.headers.length}`;
    this.artist = 'azure';

    return true;
  }

  get_json() {
    const raw = this.get_html();

    return JSON.parse(raw);
  }

  async parse_page() {
    const { url } = this;

    const json = this.get_json();
    this.find_lyric(url, json);
    this.find_info(url, json);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    const url = 'https://franks543-lyric-get.azurewebsites.net/info';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

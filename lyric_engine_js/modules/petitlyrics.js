const LyricBase = require('../include/lyric-base');

const keyword = 'petitlyrics';

class Lyric extends LyricBase {
  find_song_id(html) {
    const pattern = /lyrics_id:(\d+)/;
    return this.get_first_group_by_pattern(html, pattern);
  }

  async get_html_and_plsession(url) {
    const resp = await fetch(url);
    const cookie = resp.headers.get('set-cookie');
    const plsession = this.get_first_group_by_pattern(
      cookie,
      /PLSESSION=([a-z0-9]+);/
    );

    const html = await resp.text();
    return {
      html,
      plsession,
    };
  }

  async get_csrf_token(html, plsession) {
    const pattern = /(\/lib\/pl-lib.js[^"]+)/;
    const library_pl_js = this.get_first_group_by_pattern(html, pattern);
    if (!library_pl_js) {
      console.warn('Failed to get pl-lib.js url');
      return false;
    }

    const site_url = 'https://petitlyrics.com';
    const js_url = `${site_url}${library_pl_js}`;

    const resp = await fetch(js_url, {
      headers: {
        cookie: `PLSESSION=${plsession}`,
      },
    });

    const js_raw = await resp.text();
    if (!js_raw) {
      console.warn('Failed to get js content, url:', js_url);
      return false;
    }

    const token_pattern = /'X-CSRF-Token', '(.*?)'/;
    const csrf_token = this.get_first_group_by_pattern(js_raw, token_pattern);

    return csrf_token;
  }

  async get_lyrics_by_ajax(song_id, plsession, csrf_token) {
    const lyric_url = 'https://petitlyrics.com/com/get_lyrics.ajax';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRF-Token': csrf_token,
      'X-Requested-With': 'XMLHttpRequest',
      cookie: `PLSESSION=${plsession}`,
    };
    const body = `lyrics_id=${song_id}`;

    const resp = await fetch(lyric_url, {
      method: 'POST',
      headers,
      body,
    });
    if (resp.status !== 200) {
      console.warn(`failed to get response, status: ${resp.status}`);
      console.log(resp);
      return '';
    }

    const text = await resp.text();
    const items = JSON.parse(text);

    const lyric = items
      .map((item) => Buffer.from(item.lyrics, 'base64'))
      .join('\n');

    return lyric;
  }

  async find_lyric(song_id, plsession, csrf_token) {
    const lyric = await this.get_lyrics_by_ajax(song_id, plsession, csrf_token);

    this.lyric = lyric.trim();
    return true;
  }

  get_info_one(text, prefix, suffix) {
    const result = this.find_string_by_prefix_suffix(
      text,
      prefix,
      suffix,
      false
    );
    if (!result) {
      return '';
    }
    return this.sanitize_html(result);
  }

  async find_info(url, html) {
    const prefix = '<div class="title-bar">';
    const suffix = '</div>';
    const title_bar = this.find_string_by_prefix_suffix(
      html,
      prefix,
      suffix,
      true
    );
    if (title_bar) {
      this.title = this.get_info_one(title_bar, 'title-bar">', '<!-- ');
      this.artist = this.get_info_one(title_bar, '<!-- / ', '-->');
    } else {
      console.warn('Failed to find title bar');
    }

    this.lyricist = this.get_info_one(
      html,
      '<b>&#20316;&#35422;&#65306;</b>',
      '\t'
    );
    this.composer = this.get_info_one(
      html,
      '<b>&#20316;&#26354;&#65306;</b>',
      '\t'
    );
  }

  async parse_page() {
    const { url } = this;

    const { html, plsession } = await this.get_html_and_plsession(url);
    // console.log('plsession:', plsession);

    const csrf_token = await this.get_csrf_token(html, plsession);
    // console.log('csrf_token:', csrf_token);

    const song_id = this.find_song_id(html);
    // console.log('song_id:', song_id);

    await this.find_lyric(song_id, plsession, csrf_token);
    await this.find_info(url, html);

    return true;
  }
}

exports.keyword = keyword;
exports.Lyric = Lyric;

if (require.main === module) {
  (async () => {
    //         const url = 'https://petitlyrics.com/lyrics/2640215';
    //         const url = 'https://petitlyrics.com/lyrics/2664168';
    const url = 'https://petitlyrics.com/lyrics/1209279';
    const object = new Lyric(url);
    const lyric = await object.get();
    console.log(lyric);
  })();
}

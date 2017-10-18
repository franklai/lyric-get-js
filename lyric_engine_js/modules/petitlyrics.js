const util = require('util');
const he = require('he');
const striptags = require('striptags');
const superagent = require('superagent');

const LyricBase = require('../include/lyric_base');
const keyword = 'petitlyrics';

class Lyric extends LyricBase {
    find_song_id(html) {
        const pattern = /lyrics_id:([0-9]+)/;
        return this.get_first_group_by_pattern(html, pattern);
    }

    get_1st_part(html) {
        const prefix = '<canvas '
        const suffix = '</canvas>'
        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
        if (!lyric) {
            console.warn('Failed to find lyric');
            return false;
        }

        lyric = striptags(lyric);
        lyric = he.decode(lyric);

        return lyric;
    }

    async get_csrf_token(html) {
        const pattern = /(\/lib\/pl-lib.js[^"]+)/;
        const lib_pl_js = this.get_first_group_by_pattern(html, pattern);
        if (!lib_pl_js) {
            console.warn('Failed to get pl-lib.js url');
            return false;
        }

        const site_url = 'https://petitlyrics.com';
        const js_url = `${site_url}${lib_pl_js}`;

        const res = await this.agent.get(js_url);
        const js_raw = res.text;

        if (!js_raw) {
            console.warn('Failed to get js content, url:', js_url);
            return false;
        }

        const token_pattern = /'X-CSRF-Token', '(.*?)'/;
        const token = this.get_first_group_by_pattern(js_raw, token_pattern);

        return token;
    }

    async get_2nd_part(html) {
        const song_id = this.find_song_id(html);
        console.log('song_id:', song_id);

        const csrf_token = await this.get_csrf_token(html);
        if (!csrf_token) {
            console.warn('Failed to get CSRF token');
            return false;
        }
        console.log('csrf token:', csrf_token);

        const lyric_url = 'https://petitlyrics.com/com/get_lyrics.ajax';
        const headers = {
            'X-CSRF-Token': csrf_token,
            'X-Requested-With': 'XMLHttpRequest',
        };
        const body = `lyrics_id=${song_id}`;

        console.log('song id:', song_id);
        const res = await this.agent
            .post(lyric_url)
            .set(headers)
            .send(body);

        if (!res) {
            console.warn('Failed to get lyrics using post');
            return false;
        }

        const items = res.body;
        let lyric = items.map(item => Buffer.from(item.lyrics, 'base64')).join('\n');

        return lyric;
    }

    async find_lyric(url, html) {
        const lyric = await this.get_2nd_part(html);

        this.lyric = lyric.trim();
        return true;
    }

    get_info_one(text, prefix, suffix) {
        const result = this.find_string_by_prefix_suffix(text, prefix, suffix, false);
        if (!result) {
            return '';
        }
        return he.decode(result);
    }

    async find_info(url, html) {
        const prefix = '<div class="title-bar">'
        const suffix = '</div>'
        let title_bar = this.find_string_by_prefix_suffix(html, prefix, suffix, true);
        if (title_bar) {
            this.title = this.get_info_one(title_bar, 'title-bar">', '<!-- ');
            this.artist = this.get_info_one(title_bar, '<!-- / ', '-->');
        } else {
            console.warn('Failed to find title bar');
        }

        this.lyricist = this.get_info_one(html, '<b>&#20316;&#35422;&#65306;</b>', '\t');
        this.composer = this.get_info_one(html, '<b>&#20316;&#26354;&#65306;</b>', '\t');
    }

    async parse_page() {
        const url = this.url;

        this.agent = superagent.agent();

        const res = await this.agent.get(url);
        const html = res.text;

        await this.find_lyric(url, html);
        await this.find_info(url, html);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
//         const url = 'https://petitlyrics.com/lyrics/2640215';
//         const url = 'https://petitlyrics.com/lyrics/2664168';
        const url = 'https://petitlyrics.com/lyrics/2664256';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

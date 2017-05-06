const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'kget';

class Lyric extends LyricBase {
    async find_lyric(url, html) {
        const prefix = '<div id="lyric-trunk">';
        const suffix = '</div>';

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const pattern = '<h1.*?>(.*)</h1>';
        const value = this.get_first_group_by_pattern(html, pattern);
        if (value) {
            this.title = striptags(he.decode(value)).trim();
        } else {
            console.warn('Failed to parse title of url:', url);
            return false;
        }

        const prefix = '<table class="lyric-data">';
        const suffix = '</table>';
        const table_str = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

        const patterns = {
            'artist': '">([^<]*)</a></span></td></tr>',
            'lyricist': 'td>([^<]*)<br></td></tr>',
            'composer': 'td>([^<]*)<br></td></tr>',
        }

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            let value = this.get_first_group_by_pattern(table_str, key_for_pattern);
            value = striptags(he.decode(value)).trim();
            
            if (value) {
                this[key] = value;
            }
        }

    }

    async parse_page() {
        const url = this.url;

        const html = await rp(url);

        await this.find_lyric(url, html);
        await this.find_info(url, html);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'http://www.kget.jp/lyric/11066/';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

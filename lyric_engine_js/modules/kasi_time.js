const util = require('util');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'kasi-time';

class Lyric extends LyricBase {
    async get_html(url) {
        const raw = await rp(url);

        if (!raw) {
            console.warn('Failed to get content of url:', url);
            return false; 
        }
        
        return raw;
    }
    find_lyric(html) {
        const prefix = "var lyrics = '";
        const suffix = "';";

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        lyric = lyric.replace(/<br>/g, '\n');
        lyric = he.decode(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    find_info(html) {
        const pattern = '<h1>(.*)</h1>';
        let value = this.get_first_group_by_pattern(html, pattern);
        if (value) {
            this.title = value.trim();
        } else {
            console.error('Failed to find title of url', this.url);
            return false;
        }

        const prefix = '<div class="person_list">';
        const suffix = '</div>';
        const info_table = this.find_string_by_prefix_suffix(html, prefix, suffix);

        const patterns = {
            'artist': '歌手',
            'lyricist': '作詞',
            'composer': '作曲',
            'arranger': '編曲',
        }

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            const prefix = util.format('<th>%s</th>', key_for_pattern);
            const suffix = '</td>';

            let value = this.find_string_by_prefix_suffix(info_table, prefix, suffix, false);
            if (!value) {
                continue;
            }
            const pos = value.indexOf('関連リンク:');
            if (pos > 0) {
                value = value.substr(0, pos);
            }
            value = value.replace(/\t/g, '').replace(/\n/g, '');
            value = he.decode(value);
            value = striptags(value).trim();

            if (value) {
                this[key] = value;

                console.log('key:', key, ', value:', value)
            }
        }
    }

    async parse_page() {
        const url = this.url;

        const html = await this.get_html(url);
        this.find_lyric(html);
        this.find_info(html);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'http://www.kasi-time.com/item-64395.html';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

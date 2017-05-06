const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'kashinavi';

class Lyric extends LyricBase {
    find_song_id(url) {
        const pattern = /\?([0-9]+)/;
        return this.get_first_group_by_pattern(url, pattern);
    }

    async find_lyric(url) {
        const id = this.find_song_id(url);
        const kashi_url = 'http://kashinavi.com/s/kashi.php?no=' + id;
        const raw = await rp({url: kashi_url, encoding: null});
        const html = iconv.decode(raw, 'sjis');

        const prefix = ";'>";
        const suffix = '")';
        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        lyric = lyric.replace(/<br>/g, '\n');
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url) {
        const raw = await rp({url: url, encoding: null});
        const html = iconv.decode(raw, 'sjis');

        const prefix = '<table border=0 cellpadding=0 cellspacing=5>';
        const suffix = '<hr noshade size=1>';
        const table_str = this.find_string_by_prefix_suffix(html, prefix, suffix, false);

        const patterns = {
            'title': '<td valign=top><h2>([^<]+?)</h2>',
            'artist': '<td valign=top><h3><a href="[^"]+">(.+?)</a></h3></td>',
            'lyricist': '作詞　：　([^<]+)<br>',
            'composer': '作曲　：　([^<]+)</td>'
        }

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            let value = this.get_first_group_by_pattern(table_str, key_for_pattern);
            value = striptags(value).trim();
            
            if (value) {
                this[key] = value;
            }
        }

    }

    async parse_page() {
        const url = this.url;

        await this.find_lyric(url);
        await this.find_info(url);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'http://kashinavi.com/song_view.html?17783';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

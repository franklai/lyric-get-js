const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'j-total';

class Lyric extends LyricBase {
    async find_lyric(url, html) {
        const prefix = '<!--HPSTART-->';
        const suffix = '<!--HPEND-->';

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        if (!lyric) {
            console.error('Failed to find lyric of url:', url);
            return false;
        }

        lyric = lyric.replace(/     +/g, '');
        lyric = lyric.replace(/\r/g, '');
        lyric = lyric.replace(/\n/g, '');
        lyric = lyric.replace(/<br>/g, '\n');
        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const prefix = '<font size="4" color="#FFFFFF">';
        const suffix = '<tr bgcolor="#CCCCCC">';

        const info_str = this.find_string_by_prefix_suffix(html, prefix, suffix);

        const patterns = {
            'title': ' color="#FFFFFF"><b>(.*?)</b></font>',
            'artist': '歌：(.*?)/',
            'lyricist': '詞：(.*?)/',
            'composer': '曲：(.*?)<',
        }

        this.fill_song_info(info_str, patterns);
    }

    async parse_page() {
        const url = this.url;

        const raw = await rp({url: url, encoding: null});
        const html = iconv.decode(raw, 'sjis');

        await this.find_lyric(url, html);
        await this.find_info(url, html);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'http://music.j-total.net/data/026ha/053_Perfume/038.html';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

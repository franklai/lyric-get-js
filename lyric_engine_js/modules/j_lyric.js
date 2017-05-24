const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'j-lyric.net';

class Lyric extends LyricBase {
    async find_lyric(url, html) {
        const prefix = '<p id="Lyric">';
        const suffix = '</p>';

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        if (!lyric) {
            console.error('Failed to find lyric of url:', url);
            return false;
        }

        lyric = lyric.replace(/<br>/g, '\n');
        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const patterns = {
            'title': '<div class="cap"><h2>(.*?)</h2></div>',
            'artist': '<p class="sml">歌：(.*?)</p>',
            'lyricist': '<p class="sml">作詞：(.*?)</p>',
            'composer': '<p class="sml">作曲：(.*?)</p>',
        }

        this.fill_song_info(html, patterns);
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
        const url = 'http://j-lyric.net/artist/a04cc4b/l020e9b.html';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

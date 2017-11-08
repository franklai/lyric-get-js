const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'animationsong';

class Lyric extends LyricBase {
    async find_lyric(url, html) {
        const prefix = '<h2>歌詞</h2>';
        const suffix = '</div>';

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        if (!lyric) {
            console.error('Failed to find lyric of url:', url);
            return false;
        }

        lyric = lyric.replace(/<br \/>/g, '');
        lyric = lyric.replace(/<p>/g, '');
        lyric = lyric.replace(/<\/p>/g, '\n');
        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const prefix = '<div class="kashidescription">';
        const suffix = '</div>';

        let info_str = this.find_string_by_prefix_suffix(html, prefix, suffix);
        if (!info_str) {
            this.find_info_alt_ver(url, html);
            return false;
        }
        info_str = info_str.replace(/\n/g, '');

        const patterns = {
            'title': '<h1>(.*?)</h1>',
            'artist': '<th>歌手</th><td>(.*?)</td>',
            'lyricist': '作詞.*?：(.*?)[　<]',
            'composer': '作曲.*?：(.*?)[　<]',
            'arranger': '編曲：(.*?)<',
        }

        this.fill_song_info(info_str, patterns);
    }

    find_info_alt_ver(url, html) {
        // <meta property="og:title" content="ZARD「運命のルーレット廻して」"
        const pattern = '<meta property="og:title" content="(.*?)「(.*?)」"';

        const regex = new RegExp(pattern);
        const result = regex.exec(html);
        if (result && result.length >= 3) {
            this.artist = result[1];
            this.title = result[2];
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
        // const alt_url = 'http://animationsong.com/archives/767560.html';
        const url = 'http://animationsong.com/archives/1803492.html';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}
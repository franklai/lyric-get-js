const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'lyrics.wikia';

class Lyric extends LyricBase {
    async find_lyric(url, html) {
        const prefix = "<div class='lyricbox'>";
        const suffix = "<div class='lyricsbreak'>";

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
        if (!lyric) {
            console.error('Failed to find lyric of url:', url);
            return false;
        }

        lyric = lyric.replace(/<br \/>/g, '\n');

        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const pattern = '<meta property="og:title" content="([^"]+)" />';

        let value = this.get_first_group_by_pattern(html, pattern);
        if (!value) {
            return false;
        }

        let [artist, title] = value.split(':');

        this.artist = artist;
        this.title = title;
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
        const url = 'http://lyrics.wikia.com/wiki/%E5%9D%82%E6%9C%AC%E7%9C%9F%E7%B6%BE_(Maaya_Sakamoto):Tune_The_Rainbow';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

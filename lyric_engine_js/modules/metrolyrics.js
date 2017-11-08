const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'metrolyrics';

class Lyric extends LyricBase {
    remove_noise(lyric) {
        const items = [[
            '<div id="mid-song-discussion"',
            '<span class="label">See all</span>\n</a>\n</div>'
        ], [
            '<p class="writers">',
            '</sd-lyricbody>'
        ], [
            '\n<!--WIDGET - RELATED-->',
            '<!-- Second Section -->\n'
        ], [
            '\n<!--WIDGET - PHOTOS-->',
            '<!-- Third Section -->\n'
        ]];

        for (const [prefix, suffix] of items) {
            const noise = this.find_string_by_prefix_suffix(lyric, prefix, suffix);
            if (noise) {
                lyric = lyric.replace(noise, '');
            }
        }

        return lyric;
    }

    async find_lyric(url, html) {
        const prefix = '<div class="lyrics-body">';
        const suffix = '</sd-lyricbody>';

        let lyric = this.find_string_by_prefix_suffix(html, prefix, suffix);
        if (!lyric) {
            console.error('Failed to find lyric of url:', url);
            return false;
        }

        lyric = this.remove_noise(lyric);

        lyric = lyric.replace(/<br \/>/g, '\n');
        lyric = lyric.replace(/<p class='verse'>/g, '\n\n');

        lyric = he.decode(lyric);
        lyric = striptags(lyric);
        lyric = lyric.trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url, html) {
        const patterns = {
            'title': '"musicSongTitle":"(.*?)"',
            'artist': '"musicArtistName":"(.*?)"',
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
        const url = 'http://www.metrolyrics.com/wherever-you-are-lyrics-one-ok-rock.html';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

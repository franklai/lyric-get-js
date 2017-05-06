const util = require('util');
const iconv = require('iconv-lite');
const rp = require('request-promise');

const LyricBase = require('../include/lyric_base');
const keyword = 'utamap';

class Lyric extends LyricBase {
    async get_content(url) {
        const html = await rp(url);
        return html;
    }

    find_song_id(url) {
        const pattern = /surl=([^&=]+)/;
        const result = pattern.exec(url);

        return result ? result[1] : null;
    }
    
    async find_lyric(url) {
        const song_id = this.find_song_id(url);

        if (!song_id) {
            console.warn('Failed to get song id of url:', song_url);
            return false;
        }

        const song_url = 'http://www.utamap.com/phpflash/flashfalsephp.php?unum=' + song_id;
        const raw = await rp(song_url);
        if (!raw) {
            console.warn('Failed to get content of url:', song_url);
            return false; 
        }

        const prefix = 'test2='
        let pos = raw.indexOf(prefix);
        if (pos === -1) {
            console.warn('Failed to find test2=');
            return false;
        }

        let lyric = raw.substr(pos + prefix.length).trim();

        this.lyric = lyric;
        return true;
    }

    async find_info(url) {
        // set encoding to null, to let response is Buffer, not String
        const raw = await rp({url: url, encoding: null});
        let html = iconv.decode(raw, 'eucjp');

        if (html.indexOf('うたまっぷ') === -1) {
            html = iconv.decode(raw, 'sjis');
        }

        const patterns = {
            'title': 'title',
            'artist': 'artist',
            'lyricist': 'sakusi',
            'composer': 'sakyoku',
        }

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            const pattern = new RegExp(util.format('<INPUT type="hidden" name=%s value="([^"]*)">', key_for_pattern));
            const result = pattern.exec(html);

            if (result) {
                const value = result[1].trim();
                this[key] = value;

                console.log('key:', key, ', value:', value)
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
        const url = 'http://www.utamap.com/showkasi.php?surl=70380';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

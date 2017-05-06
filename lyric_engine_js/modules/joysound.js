const util = require('util');
const iconv = require('iconv-lite');
const he = require('he');
const rp = require('request-promise');
const striptags = require('striptags');

const LyricBase = require('../include/lyric_base');
const keyword = 'joysound';

class Lyric extends LyricBase {
    find_song_id(url) {
        const pattern = '/song/([0-9]+)';
        return this.get_first_group_by_pattern(url, pattern);
    }

    async get_song_json(id) {
        const json_url = 'https://mspxy.joysound.com/Common/Lyric';
        //const json_url = 'http://192.168.1.9';
        const headers = {
            'X-JSP-APP-NAME': '0000800'
        };
        const body = {
            'kind': 'naviGroupId',
            'selSongNo': id,
            'interactionFlg': '0',
            'apiVer': '1.0',
        };

        const json = await rp({
            method: 'POST',
            uri: json_url,
            headers: headers,
            form: body,
            json: true,
        });

        return json;
    }

    async find_lyric(url, json) {
        if (!json || !json.lyricList || json.lyricList.length !== 1) {
            return false;
        }

        let lyric = json.lyricList[0].lyric;
        lyric = lyric.trim();

        this.lyric = lyric;

        return true;
    }

    async find_info(url, json) {
        const patterns = {
            'title': 'songName',
            'artist': 'artistName',
            'lyricist': 'lyricist',
            'composer': 'composer',
        };

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            const value = json[key_for_pattern];

            this[key] = value;
        }

    }

    async parse_page() {
        const url = this.url;

        const id = this.find_song_id(url);
        const json = await this.get_song_json(id);

        await this.find_lyric(url, json);
        await this.find_info(url, json);

        return true;
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'https://www.joysound.com/web/search/song/21599';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

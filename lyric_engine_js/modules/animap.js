const util = require('util');
const iconv = require('iconv-lite');
const rp = require('request-promise');

const keyword = 'animap';

const Utamap = require('./utamap');

class Lyric extends Utamap.Lyric {
    async find_info(url) {
        // set encoding to null, to let response is Buffer, not String
        const raw = await rp({url: url, encoding: null});
        const html = iconv.decode(raw, 'eucjp');

        const patterns = {
            'title': '曲名',
            'artist': '歌手',
            'lyricist': '作詞',
            'composer': '作曲',
        }

        const get_info_value_by_key = (html, key) => {
            const valuePrefix = '#ffffff>&nbsp;'
            const valueSuffix = '</TD>'
            const posKey = html.indexOf(key + '</TD>');
            const lenPrefix = valuePrefix.length;

            const posStart = html.indexOf(valuePrefix, posKey) + lenPrefix;
            const posEnd = html.indexOf(valueSuffix, posStart);

            return html.substr(posStart, posEnd - posStart);
        };

        for (let key in patterns) {
            const key_for_pattern = patterns[key];

            const result = get_info_value_by_key(html, key_for_pattern);

            if (result) {
                const value = result.trim();
                this[key] = value;

                console.log('key:', key, ', value:', value)
            }
        }
    }
}

exports.keyword = keyword;
exports.Lyric  = Lyric;

if (require.main === module) {
    (async function() {
        const url = 'http://www.animap.jp/kasi/showkasi.php?surl=k-170315-117';
        const obj = new Lyric(url);
        const lyric =  await obj.get();
        console.log(lyric);
    })();
}

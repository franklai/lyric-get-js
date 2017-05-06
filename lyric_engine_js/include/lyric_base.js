const util = require('util');

const ATTR_LIST = [
    ['artist', '歌手'],
    ['lyricist', '作詞'],
    ['composer', '作曲'],
    ['arranger', '編曲'],
];

class LyricBase {
    constructor(url) {
        this.url = url;
    }

    async get() {
        if (!await this.parse_page()) {
            return null;
        }

        return this.get_full();
    }

    get_full() {
        // template of full information
        let template = [];

        if (this.title) {
            template.push(this.title);
            template.push('');
        }

        ATTR_LIST.forEach((attr) => {
            const key = attr[0];
            const translate = attr[1];

            if (this[key]) {
                template.push(util.format('%s：%s', translate, this[key]));
            }
        });

        if (template.length > 2) {
            template.push('');
            template.push('');
        }
        template.push(this.lyric);

        return template.join('\n');
    }

    async parse_page() {
        this.title = 'base class';
        throw 'Implement this function!';
    }

    find_string_by_prefix_suffix(input, prefix, suffix, including=true) {
        const start = input.indexOf(prefix);
        if (start === -1) {
            return false;
        }

        const end = input.indexOf(suffix, start + prefix.length);
        if (end === -1) {
            return false;
        }

        if (including === true) {
            return input.substr(start, end - start + suffix.length);
        } else {
            return input.substr(start + prefix.length, end - start - prefix.length);
        }
    }

    get_first_group_by_pattern(input, pattern) {
        const regex = new RegExp(pattern);
        const result = regex.exec(input);
        if (result && result.length >= 2) {
            return result[1];
        }
        return null;
    }
}

module.exports = LyricBase;

const { format } = require('util');

const { decode } = require('html-entities');
const iconv = require('iconv-lite');
const striptags = require('striptags');
const superagent = require('superagent');

require('superagent-proxy')(superagent);

const ATTR_LIST = [
  ['artist', '歌手'],
  ['lyricist', '作詞'],
  ['composer', '作曲'],
  ['arranger', '編曲'],
];
const USER_AGENT = 'Mozilla/5.0 Gecko/20100101 Firefox/92.0 Lyric Get/2.0';
const PROXY = 'http://45.145.150.50:3128';

class LyricBase {
  constructor(url) {
    this.url = url;
  }

  async get() {
    await this.parse_page();
    return this.get_full();
  }

  get_json() {
    const object = {
      title: this.title,
      lyric: this.lyric,
    };

    for (const attribute of ATTR_LIST) {
      const key = attribute[0];
      object[key] = this[key];
    }

    return object;
  }

  get_full() {
    // template of full information
    const template = [];

    if (this.title) {
      template.push(this.title, '');
    }

    for (const attribute of ATTR_LIST) {
      const key = attribute[0];
      const translate = attribute[1];

      if (this[key]) {
        template.push(format('%s：%s', translate, this[key]));
      }
    }

    if (template.length > 2) {
      template.push('', '');
    }
    template.push(this.lyric);

    return template.join('\n');
  }

  async parse_page() {
    this.title = 'base class';
    throw new Error('Implement this function!');
  }

  find_string_by_prefix_suffix(input, prefix, suffix, including = true) {
    const start = input.indexOf(prefix);
    if (start === -1) {
      return false;
    }

    const end = input.indexOf(suffix, start + prefix.length);
    if (end === -1) {
      return false;
    }

    if (including === true) {
      return input.slice(start, end + suffix.length);
    }
    return input.slice(start + prefix.length, end);
  }

  get_first_group_by_pattern(input, pattern) {
    const regex = new RegExp(pattern);
    const result = regex.exec(input);
    let value;
    if (result && result.length >= 2) {
      // eslint-disable-next-line prefer-destructuring
      value = result[1];
    }
    return value;
  }

  async get_html_by_proxy(url, options = {}) {
    return this.get_html(url, options, PROXY);
  }

  async get_html(url, options = {}, proxy = '') {
    const { encoding = 'utf-8' } = options;
    const headers = {
      'User-Agent': USER_AGENT,
    };

    try {
      const response = await superagent
        .get(url)
        .proxy(proxy)
        .set(headers)
        .responseType('arraybuffer');

      return iconv.decode(response.body, encoding);
    } catch (error) {
      if (error.status === 403) {
        console.error(`Failed to request ${url}. Response code 403`);
        // console.error(iconv.decode(error.response.body, encoding));
      }
      throw error;
    }
  }

  async post_form(url, body, options = {}) {
    const { headers = { 'User-Agent': USER_AGENT } } = options;

    const response = await superagent
      .post(url)
      .set(headers)
      .type('form')
      .send(body);

    return response.body;
  }

  sanitize_html(value) {
    return striptags(decode(value)).trim();
  }

  fill_song_info(content, patterns) {
    for (const key of Object.keys(patterns)) {
      const key_for_pattern = patterns[key];

      let value = this.get_first_group_by_pattern(content, key_for_pattern);
      if (value) {
        value = this.sanitize_html(value);

        this[key] = value;
      }
    }
  }
}

module.exports = LyricBase;

const { decode } = require('html-entities');
const fs = require('fs');
const iconv = require('iconv-lite');
const striptags = require('striptags');
const path = require('path');

const ATTR_LIST = [
  ['artist', '歌手'],
  ['lyricist', '作詞'],
  ['composer', '作曲'],
  ['arranger', '編曲'],
];
const USER_AGENT = 'Mozilla/5.0 Gecko/20100101 Firefox/94.0 Lyric Get/2.0';

function get_impers_library_path() {
  const extensions = {
    darwin: '.dylib',
    linux: '.so',
    win32: '.dll',
  };
  const extension = extensions[process.platform];
  if (!extension) {
    throw new Error(`impers is not supported on ${process.platform}`);
  }

  return path.join(
    __dirname,
    '..',
    '..',
    'vendor',
    'libcurl-impersonate',
    `${process.platform}-${process.arch}`,
    `libcurl-impersonate${extension}`
  );
}

class LyricBase {
  constructor(url) {
    this.url = url;
  }

  async get() {
    await this.parse_page();
    return this.get_full();
  }

  /**
   *
   * @returns {object} title and lyric
   */
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

  /**
   *
   * @returns {string} song info and lyric
   */
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
        template.push(`${translate}：${this[key]}`);
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

  /**
   *
   * @param {string} input String to find
   * @param {string} prefix Prefix
   * @param {string} suffix Suffix
   * @param {boolean} including Returned string includes prefix/suffix or not
   * @returns {string} Found string
   */
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
      value = result[1];
    }
    return value;
  }

  async get_html(url, options = {}) {
    const { encoding = 'utf8', impersonate, rejectEmptyResponse = false } = options;
    let fetch_html = fetch;
    let request_options = {
      headers: {
        'User-Agent': USER_AGENT,
      },
    };

    if (impersonate) {
      const library_path = get_impers_library_path();
      if (!fs.existsSync(library_path)) {
        throw new Error(
          `Missing libcurl-impersonate build artifact: ${library_path}. ` +
            'Run the package install script before starting the application.'
        );
      }
      process.env.LIBCURL_IMPERSONATE_PATH = library_path;
      ({ fetch: fetch_html } = await import('impers'));
      request_options = { impersonate };
    }

    try {
      const resp = await fetch_html(url, request_options);
      if (!resp.ok) {
        const err = new Error('fetch response is not ok');
        err.status = resp.status;
        err.statusText = resp.statusText;
        err.url = resp.url;
        err.headers = resp.headers;
        throw err;
      }

      const buffer = Buffer.from(await resp.arrayBuffer());
      const waf_action = resp.headers.get('x-amzn-waf-action');
      if (rejectEmptyResponse && (buffer.length === 0 || waf_action === 'challenge')) {
        const err = new Error(
          waf_action === 'challenge'
            ? 'fetch response is an AWS WAF challenge'
            : 'fetch response is empty'
        );
        err.status = resp.status;
        err.statusText = resp.statusText;
        err.url = resp.url;
        err.headers = resp.headers;
        throw err;
      }

      return iconv.decode(buffer, encoding);
    } catch (error) {
      if (error.status === 403) {
        console.error(`Failed to request ${url}. Response code 403`);
        // console.error(iconv.decode(error.response.body, encoding));
      } else {
        console.error(`Failed to request ${url}. error: ${error}`);
      }
      throw error;
    }
  }

  async post_form(url, body, options = {}) {
    const { headers = { 'User-Agent': USER_AGENT } } = options;

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    return await resp.json();
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

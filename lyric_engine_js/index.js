const fs = require('fs').promises;
const path = require('path');
const urlModule = require('url');

// let site_dict = {};
const site_array = [];

class SiteNotSupportError extends Error {
  constructor(domain) {
    const message = `Site ${domain} is not supported`;
    super(message);
    this.domain = domain;
  }
}

const load_modules = async () => {
  let files;

  try {
    files = await fs.readdir(path.join(__dirname, 'modules'));
  } catch (err) {
    console.error('Failed to load modules. err:', err);
    return;
  }

  files.forEach((f) => {
    const obj = path.parse(f);
    if (obj.ext !== '.js') {
      return;
    }
    if (f.indexOf('.test.js') !== -1) {
      return;
    }

    const obj_name = `./modules/${obj.name}`;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    site_array.push(require(obj_name));
  });
};

const get_obj = async (url) => {
  await load_modules();

  let site;

  site_array.some((item) => {
    if (url.indexOf(item.keyword) === -1) {
      return false;
    }

    site = item;
    return true;
  });

  if (!site) {
    const domain = urlModule.parse(url).hostname;
    throw new SiteNotSupportError(domain);
  }

  const obj = new site.Lyric(url);

  if (!await obj.parse_page()) {
    throw 'Parse failed.';
  }

  return obj;
};

const get_full = async (url) => {
  const obj = await get_obj(url);

  return obj.get_full();
};

const get_json = async (url) => {
  const obj = await get_obj(url);

  return obj.get_json();
};

exports.get_full = get_full;
exports.get_json = get_json;
exports.SiteNotSupportError = SiteNotSupportError;

async function main() {
  let url = 'http://www.utamap.com/showkasi.php?surl=70380';

  if (process.argv.length > 2) {
    url = process.argv[2]; // eslint-disable-line prefer-destructuring
  }

  const lyric = await get_full(url);

  console.log('lyric: ', lyric);
}

if (require.main === module) {
  main();
}

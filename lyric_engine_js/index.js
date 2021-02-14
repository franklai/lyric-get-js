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
  } catch (error) {
    console.error('Failed to load modules. err:', error);
    return;
  }

  for (const f of files) {
    const object = path.parse(f);
    if (object.ext !== '.js') {
      continue;
    }
    if (f.includes('.test.js')) {
      continue;
    }

    const object_name = `./modules/${object.name}`;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    site_array.push(require(object_name));
  }
};

const get_object = async (url) => {
  await load_modules();

  let site;

  site_array.some((item) => {
    if (!url.includes(item.keyword)) {
      return false;
    }

    site = item;
    return true;
  });

  if (!site) {
    const domain = urlModule.parse(url).hostname;
    throw new SiteNotSupportError(domain);
  }

  const object = new site.Lyric(url);

  if (!(await object.parse_page())) {
    throw 'Parse failed.';
  }

  return object;
};

const get_full = async (url) => {
  const object = await get_object(url);

  return object.get_full();
};

const get_json = async (url) => {
  const object = await get_object(url);

  return object.get_json();
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

  console.log('lyric:', lyric);
}

if (require.main === module) {
  main();
}

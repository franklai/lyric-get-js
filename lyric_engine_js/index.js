const urlModule = require('url');

const BlockedError = require('./include/blocked-error');

const animesongz = require('./modules/animesongz');
const azlyrics = require('./modules/azlyrics');
const evesta = require('./modules/evesta');
const genius = require('./modules/genius');
const hoick = require('./modules/hoick');
const jlyric = require('./modules/j-lyric');
const joysound = require('./modules/joysound');
const jtotal = require('./modules/j-total');
const kashinavi = require('./modules/kashinavi');
const kkbox = require('./modules/kkbox');
const line_music = require('./modules/line-music');
const lyrical_nonsense = require('./modules/lyrical-nonsense');
const mojim = require('./modules/mojim');
const music_jp = require('./modules/music-jp');
const musixmatch = require('./modules/musixmatch');
const nana_music = require('./modules/nana-music');
const oricon = require('./modules/oricon');
const petitlyrics = require('./modules/petitlyrics');
const rocklyric = require('./modules/rocklyric');
const self = require('./modules/self');
const tunecore = require('./modules/tunecore');
const utamap = require('./modules/utamap');
const uta_net = require('./modules/uta-net');
const utaten = require('./modules/utaten');

// let site_dict = {};
const site_array = [
  animesongz,
  azlyrics,
  evesta,
  genius,
  hoick,
  jlyric,
  joysound,
  jtotal,
  kashinavi,
  kkbox,
  line_music,
  lyrical_nonsense,
  mojim,
  music_jp,
  musixmatch,
  nana_music,
  oricon,
  petitlyrics,
  rocklyric,
  self,
  tunecore,
  utamap,
  uta_net,
  utaten,
];

class SiteNotSupportError extends Error {
  constructor(domain) {
    const message = `Site ${domain} is not supported`;
    super(message);
    this.domain = domain;
  }
}

const get_object = async (url) => {
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
    throw new Error('Parse failed.');
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
exports.BlockedError = BlockedError;

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

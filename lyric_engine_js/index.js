const path = require('path');

const fs = require('mz/fs');

// let site_dict = {};
let site_array = [];

const load_modules = async () => {
    let files;

    try {
        files = await fs.readdir(path.join(__dirname, 'modules'));
    } catch (err) {
        console.error('Failed to load modules. err:', err);
        return;
    }

    files.forEach((f) => {
        obj = path.parse(f);
        if (obj.ext !== '.js') {
            return;
        }

        let obj_name = './modules/' + obj.name;

        site_array.push(require(obj_name));
    });
};

const get_lyric = async (url) => {
    await load_modules();

    let site;

    site_array.some((item) => {
        if (url.indexOf(item.keyword) === -1) {
            return;
        }

        site = item;
        return true;
    });

    if (!site) {
        return 'Site is not supported';
    }

    const obj = new site.Lyric(url);
    return await obj.get();
}

exports.get_lyric = get_lyric;

async function main() {
    const url = 'http://www.utamap.com/showkasi.php?surl=70380';
    const lyric = await get_lyric(url);

    console.log('lyric: ', lyric);
}

if (require.main === module) {
    main();
}

const http = require('http');
const url = require('url');
const util = require('util');

const fs = require('mz/fs');
const engine = require('./lyric_engine_js')

function do_not_found(res) {
    res.writeHead(404);
    res.end();
}

http.createServer(async function (req, res) {
    const req_obj = url.parse(req.url, true);

    const pathname = (req_obj.pathname === '/') ? '/index.html' : req_obj.pathname;

    if (pathname === '/app') {
        if (!req_obj.query || !req_obj.query.url) {
            console.warn('in app, but no query');
            return do_not_found(res);
        }

        const lyric_url = req_obj.query.url;

        let out = {
            'lyric': 'error'
        };

        try {
            const lyric = await engine.get_lyric(lyric_url);
            out.lyric = lyric;
        } catch (err) {
            console.error('err:', err);
            // catch error type?
        }

        const json_str = JSON.stringify(out);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(json_str, 'utf8'),
            'Content-Type': 'application/json'
        });
        res.end(json_str);

        return;
    }

    src = util.format('%s%s', 'public', pathname);
    fs.readFile(src).then(function (data) {
        res.writeHead(200, {
            'Content-Length': data.length
        });
        res.end(data);
    }).catch(function(err) {
        return do_not_found(res);
    });
}).listen(process.env.PORT || 8866);

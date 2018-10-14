const http = require('http');
const mime = require('mime-types');
const path = require('path');
const url = require('url');
const util = require('util');

const fs = require('mz/fs');
var Raven = require('raven');
Raven.config('https://a7fa45b215ae4cf68bb9320a075234d7@sentry.io/1263950').install();

const engine = require('./lyric_engine_js')

function do_not_found(res) {
    res.writeHead(404);
    res.end();
}

const port = process.env.PORT || 8866;
console.log(`Listen to http://localhost:${port}`);

http.createServer(async function (req, res) {
    const req_obj = url.parse(req.url, true);

    let pathname = req_obj.pathname;
    if (pathname === '/') {
        pathname = '/index.html';
    } else if (pathname === '/former/') {
        pathname = '/former/index.html';
    }

    if (pathname === '/app' || pathname === '/json') {
        if (!req_obj.query || !req_obj.query.url) {
            console.warn('in app, but no query');
            return do_not_found(res);
        }

        const lyric_url = req_obj.query.url;

        let out = {
          'lyric': 'error',
        };

        if (pathname === '/app') {
          try {
              const lyric = await engine.get_full(lyric_url);
              out.lyric = lyric;
          } catch (err) {
              console.error('err:', err);
              Raven.captureException(err, { req: req });
              // catch error type?
          }
        } else if (pathname === '/json') {
          try {
              const json = await engine.get_json(lyric_url);
              if (json) {
                out = json;
              }
          } catch (err) {
              console.error('err:', err);
              Raven.captureException(err, { req: req });
              // catch error type?
          }
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
            'Content-Length': data.length,
            'Content-Type': mime.lookup(pathname) || 'application/octet-stream',
        });
        res.end(data);
    }).catch(function(err) {
        return do_not_found(res);
    });
}).listen(port);

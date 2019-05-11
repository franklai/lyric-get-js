const http = require('http');
const mime = require('mime-types');
const url = require('url');
const util = require('util');
const fs = require('mz/fs');

const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://a7fa45b215ae4cf68bb9320a075234d7@sentry.io/1263950' });

const engine = require('./lyric_engine_js');

function do_not_found(res) {
  res.writeHead(404);
  res.end();
}

const port = process.env.PORT || 8866;
console.log(`Listen to http://localhost:${port}`);

const outputJson = (res, out) => {
  const json_str = JSON.stringify(out);
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(json_str, 'utf8'),
    'Content-Type': 'application/json',
  });
  res.end(json_str);
};

const handlerEror = (req, res, err, lyric_url) => {
  console.error('err:', err);

  const out = {
    lyric: `Failed to find lyric of ${lyric_url}`,
  };

  let level = 'error';
  if (err instanceof engine.SiteNotSupportError) {
    console.log('yes site not support');
    level = 'warning';
    out.lyric = err.message;
  } else {
    console.log('no, why in else');
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    Sentry.captureException(err);
  });

  outputJson(res, out);
};

http
  .createServer(async (req, res) => {
    const req_obj = url.parse(req.url, true);

    let { pathname } = req_obj;
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
        lyric: `Failed to find lyric of ${lyric_url}`,
      };

      if (pathname === '/app') {
        try {
          const lyric = await engine.get_full(lyric_url);
          out.lyric = lyric;
        } catch (err) {
          return handlerEror(req, res, err, lyric_url);
        }
      } else if (pathname === '/json') {
        try {
          const json = await engine.get_json(lyric_url);
          if (json) {
            out = json;
          }
        } catch (err) {
          return handlerEror(req, res, err, lyric_url);
        }
      }

      return outputJson(res, out);
    }

    const src = util.format('%s%s', 'public', pathname);
    fs.readFile(src)
      .then((data) => {
        res.writeHead(200, {
          'Content-Length': data.length,
          'Content-Type': mime.lookup(pathname) || 'application/octet-stream',
        });
        res.end(data);
      })
      .catch(() => do_not_found(res));

    return '';
  })
  .listen(port);

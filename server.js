const fs = require('fs').promises;
const http = require('http');
const mime = require('mime-types');
const url = require('url');
const { format } = require('util');

const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://a7fa45b215ae4cf68bb9320a075234d7@sentry.io/1263950',
});

const engine = require('./lyric_engine_js');

function do_not_found(response) {
  response.writeHead(404);
  response.end();
}

const port = process.env.PORT || 8866;
console.log(`Listen to http://localhost:${port}`);

const outputJson = (response, out) => {
  const json_string = JSON.stringify(out);
  response.writeHead(200, {
    'Content-Length': Buffer.byteLength(json_string, 'utf8'),
    'Content-Type': 'application/json',
  });
  response.end(json_string);
};

const handleError = (request, response, error, lyric_url) => {
  console.error('err:', error);

  const out = {
    lyric: `Failed to find lyric of ${lyric_url}`,
  };

  let level = 'error';
  let domain = '';
  if (error instanceof engine.SiteNotSupportError) {
    level = 'warning';

    out.lyric = error.message;
    domain = error.domain;
  }
  if (error instanceof engine.BlockedError) {
    level = 'warning';
    out.lyric = `Failed to get lyric of ${lyric_url}. Blocked by vendor.`;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.addEventProcessor(async (event) =>
      Sentry.Handlers.parseRequest(event, request)
    );
    if (domain) {
      scope.setFingerprint(['site-not-support-error', domain]);
    }
    Sentry.captureException(error);
  });

  outputJson(response, out);
};

http
  .createServer(async (request, response) => {
    const request_object = url.parse(request.url, true);

    let { pathname } = request_object;
    if (pathname === '/') {
      pathname = '/index.html';
    } else if (pathname === '/former/') {
      pathname = '/former/index.html';
    }

    if (pathname === '/app' || pathname === '/json') {
      const { query } = request_object;
      if (!query || !query.url) {
        console.warn('in app, but no query');
        return do_not_found(response);
      }

      const { url } = query;

      let out = {
        lyric: `Failed to find lyric of ${url}`,
      };

      if (pathname === '/app') {
        try {
          const lyric = await engine.get_full(url);
          out.lyric = lyric;
        } catch (error) {
          return handleError(request, response, error, url);
        }
      } else if (pathname === '/json') {
        try {
          const json = await engine.get_json(url);
          if (json) {
            out = json;
          }
        } catch (error) {
          return handleError(request, response, error, url);
        }
      }

      return outputJson(response, out);
    }

    const source = format('%s%s', 'public', pathname);
    fs.readFile(source)
      .then((data) => {
        response.writeHead(200, {
          'Content-Length': data.length,
          'Content-Type': mime.lookup(pathname) || 'application/octet-stream',
        });
        response.end(data);
      })
      .catch(() => do_not_found(response));

    return '';
  })
  .listen(port);

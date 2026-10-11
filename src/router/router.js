const AppError = require('../errors/app.error');
const { logRequest } = require('../middleware/logger.middleware');

const MAX_BODY_BYTES = 100 * 1024;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5500';

const routes = [];

function splitPath(path) {
    return path.split('/').filter(Boolean);
}

function register(method, path, handler) {
    routes.push({ method, segments: splitPath(path), handler });
}

function get(path, handler) {
    register('GET', path, handler);
}

function post(path, handler) {
    register('POST', path, handler);
}

function patch(path, handler) {
    register('PATCH', path, handler);
}

function del(path, handler) {
    register('DELETE', path, handler);
}

function matchRoute(method, pathname) {
    const parts = splitPath(pathname);

    for (const route of routes) {
        if (route.method !== method || route.segments.length !== parts.length) {
            continue;
        }

        const params = {};
        let matched = true;

        for (let i = 0; i < parts.length; i++) {
            const segment = route.segments[i];
            if (segment.startsWith(':')) {
                params[segment.slice(1)] = parts[i];
            } else if (segment !== parts[i]) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return { handler: route.handler, params };
        }
    }

    return null;
}

async function handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const match = matchRoute(req.method, parsedUrl.pathname);

        if (!match) {
            res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: "Not Found"}));
            return;
        }

        req.params = match.params;

        if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
            req.body = await parseJSONBody(req);
        }

        const result = await match.handler(req, res);

        if (!res.writableEnded) {
            res.writeHead(res.statusCode, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(result !== undefined ? JSON.stringify(result) : '');
        }
    } catch (err) {
        if (!res.writableEnded) {
            const status = err instanceof AppError ? err.statusCode : 500;
            const message = err instanceof AppError ? err.message : "Internal Server Error";
            res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: message}));
        }
        if (!(err instanceof AppError)) {
            console.error(err);
        }
    } finally {
        logRequest(req, res.statusCode);
    }
}

function parseJSONBody(req) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
        return Promise.resolve({});
    }

    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalBytes = 0;
        let tooLarge = false;

        req.on('data', chunk => {
            if (tooLarge) return;
            totalBytes += chunk.length;
            if (totalBytes > MAX_BODY_BYTES) {
                tooLarge = true;
                reject(new AppError('Payload too large', 413));
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            if (tooLarge) return;
            const body = Buffer.concat(chunks).toString('utf8');
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(new AppError('Invalid JSON', 400));
            }
        });
        req.on('error', err => reject(err));
    });
}

module.exports = { get, post, patch, del, handleRequest };

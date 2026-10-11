const forumService = require('../services/forum.service');
const authService = require('../services/auth.service');
const { parseCookies } = require('../utils/cookies');

const SESSION_COOKIE = 'session_token';

async function listCategories(req, res) {
    return forumService.listCategories();
}

async function listThreads(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return forumService.listThreadsByCategory(url.searchParams.get('categoryId'));
}

function parseLimit(value, fallback, max) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return fallback;
    return Math.min(n, max);
}

async function listRecentThreads(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseLimit(url.searchParams.get('limit'), 5, 20);
    return forumService.listRecentThreads(limit);
}

async function createThread(req, res) {
    const { categoryId, title, isAnonymous } = req.body;
    const thread = await forumService.createThread(req.user, { categoryId, title, isAnonymous });
    res.statusCode = 201;
    return thread;
}

async function listPosts(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = parseCookies(req)[SESSION_COOKIE];
    const viewer = await authService.getOptionalUser(token);
    return forumService.listPosts(url.searchParams.get('threadId'), viewer);
}

async function createPost(req, res) {
    const { threadId, content } = req.body;
    const post = await forumService.createPost(req.user, { threadId, content });
    res.statusCode = 201;
    return post;
}

async function updatePost(req, res) {
    return forumService.updatePost(req.user, req.params.id, req.body.content);
}

async function deletePost(req, res) {
    await forumService.deletePost(req.user, req.params.id);
    res.statusCode = 204;
}

module.exports = {
    listCategories,
    listThreads,
    listRecentThreads,
    createThread,
    listPosts,
    createPost,
    updatePost,
    deletePost,
};

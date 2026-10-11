const adminService = require('../services/admin.service');
const { parseCookies } = require('../utils/cookies');
const { getSearchParams, parseLimit } = require('../utils/query');

const SESSION_COOKIE = 'session_token';

async function getDashboard(req, res) {
    return adminService.getDashboard();
}

async function listUsers(req, res) {
    return adminService.listUsers();
}

async function changeRole(req, res) {
    return adminService.changeRole(req.user, req.params.id, req.body.role);
}

async function setBanned(req, res) {
    return adminService.setBanned(req.user, req.params.id, req.body.banned === true);
}

async function revokeUserSessions(req, res) {
    return adminService.revokeUserSessions(req.user, req.params.id);
}

async function listSessions(req, res) {
    return adminService.listSessions(parseCookies(req)[SESSION_COOKIE]);
}

async function revokeSession(req, res) {
    return adminService.revokeSession(req.user, req.params.id);
}

async function listAuditLog(req, res) {
    const params = getSearchParams(req);
    return adminService.listAuditLog(parseLimit(params.get('limit'), 200, 1000));
}

async function listRequestLogs(req, res) {
    const params = getSearchParams(req);
    return adminService.listRequestLogs({
        limit: parseLimit(params.get('limit'), 200, 1000),
        statusClass: params.get('status'),
    });
}

module.exports = {
    getDashboard,
    listUsers,
    changeRole,
    setBanned,
    revokeUserSessions,
    listSessions,
    revokeSession,
    listAuditLog,
    listRequestLogs,
};

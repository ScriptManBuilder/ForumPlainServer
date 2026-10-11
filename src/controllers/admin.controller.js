const adminService = require('../services/admin.service');

async function listUsers(req, res) {
    return adminService.listUsers();
}

async function changeRole(req, res) {
    return adminService.changeRole(req.user, req.params.id, req.body.role);
}

async function setBanned(req, res) {
    return adminService.setBanned(req.user, req.params.id, req.body.banned === true);
}

module.exports = { listUsers, changeRole, setBanned };

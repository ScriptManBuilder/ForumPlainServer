const moderationService = require('../services/moderation.service');

async function setPostHidden(req, res) {
    return moderationService.setPostHidden(req.user, req.params.id, req.body.hidden === true);
}

async function setThreadLocked(req, res) {
    return moderationService.setThreadLocked(req.user, req.params.id, req.body.locked === true);
}

module.exports = { setPostHidden, setThreadLocked };

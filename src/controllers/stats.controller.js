const statsService = require('../services/stats.service');

async function getStats(req, res) {
    return statsService.getStats();
}

module.exports = { getStats };

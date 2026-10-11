const router = require('../router/router');
const statsController = require('../controllers/stats.controller');

router.get('/api/stats', statsController.getStats);

const router = require('../router/router');
const userController = require('../controllers/user.controller');

router.get('/api/users/recent', userController.listRecent);

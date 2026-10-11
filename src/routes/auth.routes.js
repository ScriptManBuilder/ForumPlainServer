const router = require('../router/router');
const authController = require('../controllers/auth.controller');

router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/me', authController.me);

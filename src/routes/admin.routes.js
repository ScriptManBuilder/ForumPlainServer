const router = require('../router/router');
const adminController = require('../controllers/admin.controller');
const { requireRole } = require('../middleware/role.middleware');

router.get('/api/admin/users', requireRole(['admin'], adminController.listUsers));
router.patch('/api/admin/users/:id/role', requireRole(['admin'], adminController.changeRole));
router.patch('/api/admin/users/:id/ban', requireRole(['admin'], adminController.setBanned));

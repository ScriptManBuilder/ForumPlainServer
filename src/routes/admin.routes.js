const router = require('../router/router');
const adminController = require('../controllers/admin.controller');
const { requireRole } = require('../middleware/role.middleware');

const adminOnly = (handler) => requireRole(['admin'], handler);

router.get('/api/admin/dashboard', adminOnly(adminController.getDashboard));

router.get('/api/admin/users', adminOnly(adminController.listUsers));
router.patch('/api/admin/users/:id/role', adminOnly(adminController.changeRole));
router.patch('/api/admin/users/:id/ban', adminOnly(adminController.setBanned));
router.del('/api/admin/users/:id/sessions', adminOnly(adminController.revokeUserSessions));

router.get('/api/admin/sessions', adminOnly(adminController.listSessions));
router.del('/api/admin/sessions/:id', adminOnly(adminController.revokeSession));

router.get('/api/admin/audit', adminOnly(adminController.listAuditLog));
router.get('/api/admin/logs', adminOnly(adminController.listRequestLogs));

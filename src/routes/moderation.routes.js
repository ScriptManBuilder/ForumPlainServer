const router = require('../router/router');
const moderationController = require('../controllers/moderation.controller');
const { requireRole } = require('../middleware/role.middleware');

const MODERATORS = ['moderator', 'admin'];

router.patch('/api/moderation/posts/:id/hidden', requireRole(MODERATORS, moderationController.setPostHidden));
router.patch('/api/moderation/threads/:id/locked', requireRole(MODERATORS, moderationController.setThreadLocked));

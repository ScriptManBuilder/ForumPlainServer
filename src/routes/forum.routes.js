const router = require('../router/router');
const forumController = require('../controllers/forum.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/api/categories', forumController.listCategories);
router.get('/api/threads', forumController.listThreads);
router.get('/api/threads/recent', forumController.listRecentThreads);
router.post('/api/threads', requireAuth(forumController.createThread));
router.get('/api/posts', forumController.listPosts);
router.post('/api/posts', requireAuth(forumController.createPost));
router.patch('/api/posts/:id', requireAuth(forumController.updatePost));
router.del('/api/posts/:id', requireAuth(forumController.deletePost));

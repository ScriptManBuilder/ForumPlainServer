const router = require('./router/router');

router.get('/api/health', function () {
    return { status: 'ok' };
});

require('./routes/auth.routes');
require('./routes/admin.routes');
require('./routes/forum.routes');
require('./routes/moderation.routes');
require('./routes/users.routes');
require('./routes/stats.routes');

module.exports = router.handleRequest;

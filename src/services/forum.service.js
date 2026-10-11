const categoryRepository = require('../repositories/category.repository');
const threadRepository = require('../repositories/threads.repository');
const postRepository = require('../repositories/posts.repository');
const AppError = require('../errors/app.error');

function parsePositiveInt(value, fieldName) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(`${fieldName} must be a positive integer`, 400);
    }
    return id;
}

async function listCategories() {
    return categoryRepository.findAll();
}

async function listThreadsByCategory(categoryId) {
    const id = parsePositiveInt(categoryId, 'categoryId');

    const rows = await threadRepository.findByCategoryId(id);

    return rows.map(row => ({
        id: row.id,
        title: row.title,
        created_at: row.created_at,
        author: row.is_anonymous ? null : row.username,
    }));
}

async function listRecentThreads(limit) {
    const rows = await threadRepository.findRecent(limit);

    return rows.map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        created_at: row.created_at,
        author: row.is_anonymous ? null : row.username,
    }));
}

async function createThread(user, { categoryId, title, isAnonymous }) {
    const category_id = parsePositiveInt(categoryId, 'categoryId');

    if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 150) {
        throw new AppError('Title must contain 3 to 150 characters', 400);
    }

    const category = await categoryRepository.findById(category_id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    const threadId = await threadRepository.create({
        category_id,
        user_id: user.id,
        title: title.trim(),
        is_anonymous: isAnonymous === true ? 1 : 0,
    });

    return { id: threadId, categoryId: category_id, title: title.trim() };
}

const MODERATOR_ROLES = ['moderator', 'admin'];

async function listPosts(threadId, viewer) {
    const id = parsePositiveInt(threadId, 'threadId');

    const rows = await postRepository.findByThreadId(id);
    const canSeeHidden = viewer && MODERATOR_ROLES.includes(viewer.role);

    return rows
        .filter(row => !row.is_hidden || canSeeHidden || (viewer && viewer.id === row.user_id))
        .map(row => ({
            id: row.id,
            content: row.content,
            created_at: row.created_at,
            updated_at: row.updated_at,
            author: row.username,
            is_hidden: Boolean(row.is_hidden),
        }));
}

async function createPost(user, { threadId, content }) {
    const thread_id = parsePositiveInt(threadId, 'threadId');

    if (typeof content !== 'string' || !content.trim()) {
        throw new AppError('Content is required', 400);
    }

    const thread = await threadRepository.findById(thread_id);
    if (!thread) {
        throw new AppError('Thread not found', 404);
    }

    if (thread.is_locked) {
        throw new AppError('Thread is locked', 403);
    }

    const postId = await postRepository.create({
        thread_id,
        user_id: user.id,
        content: content.trim(),
    });

    return { id: postId, threadId: thread_id, content: content.trim() };
}

async function findOwnedPost(user, postId) {
    const id = parsePositiveInt(postId, 'postId');

    const post = await postRepository.findById(id);
    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.user_id !== user.id) {
        throw new AppError('You can only modify your own posts', 403);
    }

    return id;
}

async function updatePost(user, postId, content) {
    const id = await findOwnedPost(user, postId);

    if (typeof content !== 'string' || !content.trim()) {
        throw new AppError('Content is required', 400);
    }

    await postRepository.updateContent(id, content.trim());

    return { id, content: content.trim() };
}

async function deletePost(user, postId) {
    const id = await findOwnedPost(user, postId);
    await postRepository.deleteById(id);
}

module.exports = {
    listCategories,
    listThreadsByCategory,
    listRecentThreads,
    createThread,
    listPosts,
    createPost,
    updatePost,
    deletePost,
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("./_index");
const model = require("../models/_index");
exports.allPostsByCategory = [];
/**
 * I'm not very good with mysql, so I use this.
 *
 * If anyone can think of a more efficient way, please update this.
 */
// wrap in closure prevent global pollution
(() => {
    const sleep = require('util').promisify(setTimeout);
    const data = new _index_1.default();
    let allData = new model.Categories.ForumCategories();
    const getPostsAndUpdateInternalRecords = () => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('grabbing posts for all categories...');
        const setupCats = (cat) => __awaiter(void 0, void 0, void 0, function* () {
            let allPostsArr = [];
            let lastLenTest = 0;
            const addNewItemsToArray = () => __awaiter(void 0, void 0, void 0, function* () {
                // console.log('grabbing for',cat.name);
                // grab posts
                // console.log('get all threads');
                let _posts = data.knex('forum_posts').where({
                    'post_category': cat.id
                }).select('*').limit(1000).orderBy('id', 'desc');
                if (allPostsArr.length > 0) {
                    _posts = _posts.andWhere('id', '<', allPostsArr[allPostsArr.length - 1]['id']);
                }
                let posts = yield _posts;
                lastLenTest = posts.length;
                // console.log('total posts got',posts.length,'for cat',cat.id);
                // console.log('order posts');
                // let posts = _.orderBy(allThreads, ['created_at'],['desc']);
                let _newPosts = [];
                let includedIds = [];
                for (const post of posts) {
                    if (includedIds.includes(post.id)) {
                        continue; // skip it
                    }
                    if (includedIds.includes(post.parent_thread)) {
                        continue; // skip it
                    }
                    if (post.parent_thread !== 0) {
                        includedIds.push(post.parent_thread);
                        _newPosts.push(post);
                    }
                    else {
                        includedIds.push(post.id);
                        _newPosts.push(post);
                    }
                }
                posts = _newPosts.slice(0, 500);
                // console.log('count all replies');
                for (const post of posts) {
                    let _grabCount = data.knex('forum_posts').count('id as total');
                    if (post.parent_thread !== 0) {
                        _grabCount = _grabCount.orWhere('parent_thread', '=', post.parent_thread);
                    }
                    else {
                        _grabCount = _grabCount.orWhere('parent_thread', '=', post.id);
                    }
                    let grabCountResults = yield _grabCount;
                    // I don't think mysql fiddles with the order (?)
                    post.reply_count = grabCountResults[0]['total'];
                }
                posts.forEach(p => {
                    allPostsArr.push(p);
                });
            });
            while (allPostsArr.length < 1000) {
                /*
                if (allPostsArr.length > 0) {
                    console.log(allPostsArr.length,'posts. trying again with offset',allPostsArr[allPostsArr.length-1]['id']);
                }
                */
                yield addNewItemsToArray();
                if (lastLenTest === 0) {
                    // :(
                    break;
                }
            }
            // console.log(cat.id,'is OK');
            // console.log('Post amount OK!',allPostsArr.length);
            // console.log('setting post data');
            let didFind = false;
            for (const subCat of exports.allPostsByCategory) {
                if (subCat.subCategoryId === cat.id) {
                    didFind = true;
                    // overwrite (or set)
                    subCat.posts = allPostsArr;
                    break;
                }
            }
            if (!didFind) {
                exports.allPostsByCategory.push({
                    subCategoryId: cat.id,
                    posts: allPostsArr,
                });
            }
        });
        let _allPromises = [];
        for (const cat of allData.subCategories) {
            if (!cat.hidden) {
                _allPromises.push(setupCats(cat));
            }
        }
        ;
        yield Promise.all(_allPromises);
    });
    const _getPostsSetup = () => __awaiter(void 0, void 0, void 0, function* () {
        while (true) {
            // console.log('all threads count',allPostsByCategory.length);
            try {
                yield getPostsAndUpdateInternalRecords();
                yield sleep(5000);
            }
            catch (err) {
                console.error(err);
            }
        }
    });
    _getPostsSetup();
})();
class Forum extends _index_1.default {
    constructor() {
        super();
    }
    getPosts(limit = 100, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const cols = [
                'id',
                'created_at',
                'post_title',
                'post_body',
                'author_id',
                'author_joindate',
                'author_postcount',
                'post_group',
                'post_category',
                'is_moderator',
                'is_top_100_poster',
                'is_top_25_poster',
                'is_top_50_poster',
                'is_thread',
                'parent_thread',
            ];
            let posts = yield this.knex('forum_posts').select(cols).limit(limit).orderBy('id', 'desc').offset(offset);
            return posts;
        });
    }
    getPostsByCategory(categoryId, limit = 100, offset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (offset >= 400) {
                return [];
            }
            // console.time('grab posts by cat');
            for (const item of exports.allPostsByCategory) {
                if (item.subCategoryId === categoryId) {
                    return item.posts.slice(offset, limit + offset);
                }
            }
            throw new Error('Query is pending or invalid categoryId');
        });
    }
    getThreadByIdWithReplies(threadId, limit = 100, offset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullData = [];
            if (offset !== 0) {
                limit = limit - 1;
            }
            let remainingPosts = [];
            if (limit !== 0) {
                remainingPosts = yield this.knex('forum_posts').select('*').where({
                    'parent_thread': threadId,
                }).limit(limit).offset(offset);
            }
            if (offset === 0) {
                let threadInfo = yield this.knex('forum_posts').select('*').where({
                    'id': threadId,
                });
                if (threadInfo[0]) {
                    remainingPosts.unshift(threadInfo[0]);
                }
            }
            let multiGetPostCount = [];
            let _idsAlreadyAwaiting = [];
            remainingPosts.forEach(p => {
                if (_idsAlreadyAwaiting.includes(p.author_id)) {
                    return;
                }
                _idsAlreadyAwaiting.push(p.author_id);
                const getUserPosts = (id) => __awaiter(this, void 0, void 0, function* () {
                    let val = yield this.getUserPostCount(id);
                    return {
                        id: id,
                        total: val,
                    };
                });
                multiGetPostCount.push(getUserPosts(p.author_id));
            });
            let postCounts = yield Promise.all(multiGetPostCount);
            remainingPosts.forEach(p => {
                for (const item of postCounts) {
                    if (item.id === p.author_id) {
                        p.author_postcount = item.total;
                    }
                }
                fullData.push(p);
            });
            return fullData;
        });
    }
    getUserPostCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts = yield this.knex('forum_posts').count('id as total').where({
                'author_id': userId,
            });
            return posts[0]['total'] || 0;
        });
    }
    /**
     * Create a thread.
     * @param title Title of the thread
     * @param body Body of the thread
     * @param authorUserId UserID of the author
     * @param group Post group
     * @param category Post category
     * @returns The post id of the thread
     * @throws {Error} Cooldown - User is on cooldown
     */
    createThread(title, body, authorUserId, group, category) {
        return __awaiter(this, void 0, void 0, function* () {
            let postId;
            yield this.knex.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                let latestPost = yield trx('forum_posts').select('created_at').where({
                    'author_id': authorUserId,
                }).forUpdate('forum_posts').limit(1).orderBy('id', 'desc');
                if (latestPost[0]) {
                    if (this.moment().isSameOrBefore(this.moment(latestPost[0].created_at * 1000).add(30, 'seconds'))) {
                        throw new Error('Cooldown');
                    }
                }
                postId = yield trx('forum_posts').insert({
                    'created_at': this.moment().unix(),
                    'post_title': title,
                    'post_body': body,
                    'author_id': authorUserId,
                    'author_joindate': 0,
                    'author_postcount': 0,
                    'post_group': group,
                    'post_category': category,
                    'is_moderator': 0,
                    'is_top_100_poster': 0,
                    'is_top_25_poster': 0,
                    'is_top_50_poster': 0,
                    'is_thread': 1,
                    'parent_thread': 0,
                });
            }));
            return postId[0];
        });
    }
    /**
     * Create a post (aka a "reply" to a threadId)
     * @param postId The ID of the post to reply to
     * @param body
     * @param authorUserId
     * @returns The ID of the post
     */
    createPost(postId, body, authorUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnPostId;
            let totalReplyCountForThread;
            yield this.knex.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                let latestPost = yield trx('forum_posts').select('created_at').where({
                    'author_id': authorUserId,
                }).forUpdate('forum_posts').limit(1).orderBy('id', 'desc');
                if (latestPost[0]) {
                    if (this.moment().isSameOrBefore(this.moment(latestPost[0].created_at * 1000).add(30, 'seconds'))) {
                        throw new Error('Cooldown');
                    }
                }
                let postToReplyTo = yield trx('forum_posts').select('is_thread', 'parent_thread', 'post_title', 'post_group', 'post_category', 'created_at').where({
                    'id': postId,
                }).limit(1);
                if (postToReplyTo[0]) {
                    if (postToReplyTo[0]['is_thread'] === 0 || postToReplyTo[0]['parent_thread'] !== 0) {
                        throw new Error('PostID is not a thread');
                    }
                    if (postToReplyTo[0]['created_at'] <= 1514764800) {
                        throw new Error('LockedThread');
                    }
                    // OK
                }
                else {
                    throw new Error('InvalidPostId');
                }
                returnPostId = yield trx('forum_posts').insert({
                    'created_at': this.moment().unix(),
                    'post_title': postToReplyTo[0]['post_title'],
                    'post_body': body,
                    'author_id': authorUserId,
                    'author_joindate': 0,
                    'author_postcount': 0,
                    'post_group': postToReplyTo[0]['post_group'],
                    'post_category': postToReplyTo[0]['post_category'],
                    'is_moderator': 0,
                    'is_top_100_poster': 0,
                    'is_top_25_poster': 0,
                    'is_top_50_poster': 0,
                    'is_thread': 0,
                    'parent_thread': postId,
                });
                let totalReplyCount = yield trx('forum_posts').count('id as total').where({
                    'parent_thread': postId,
                });
                totalReplyCountForThread = totalReplyCount[0]['total'] + 1;
            }));
            return {
                postId: returnPostId[0],
                replyCount: totalReplyCountForThread,
                expectedPage: Math.ceil(totalReplyCountForThread / 25),
            };
        });
    }
    countPostsForSubCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts = yield this.knex('forum_posts').count('id as total').where({
                'post_category': id,
            });
            let threads = yield this.knex('forum_posts').count('id as total').where('parent_thread', '!=', 0).andWhere({
                'post_category': id,
            });
            return {
                posts: posts[0]['total'],
                threads: threads[0]['total'],
            };
        });
    }
    multiGetLatestPostsForSubcategory(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let allQueries = [];
            for (const id of ids) {
                allQueries.push(this.knex('forum_posts').select('*').orderBy('id', 'desc').where('post_category', '=', id).limit(1));
            }
            let all = yield Promise.all(allQueries);
            return all;
        });
    }
}
exports.Forum = Forum;
//# sourceMappingURL=forum.js.map
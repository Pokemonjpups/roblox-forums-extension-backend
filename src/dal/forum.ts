import dal from './_index';
import * as model from '../models/_index';
import _ = require('lodash');

export const allPostsByCategory: { subCategoryId: number; posts: any[] }[] = [];


/**
 * The general idea with this giant method here is to allow the latest
 * posts per forum category to be grabbed with Forum.getPosts(). I can't
 * just do a basic MySQL select due to how the database is structured, so
 * I've been left with trying to do my own custom thing that works okay.
 * 
 * This method will go through the latest 1000 posts per category, then 
 * grab the latest thread or latest reply to a thread and skip over any
 * other replies to the same thread (if that makes sense).
 * 
 * Sadly, there are some downfalls to the way I decided to implement this:
 *    1. 1000 posts from every non-hidden category must be stored in memory
 *    2. App startup time is increased drastically. It can take up to a few
 *    minutes (depending on your servers speed) before Forum.getPosts() will
 *    start returning results.
 *    3. It is not possible to paginate past the first 1,000 posts
 *    4. It does not update instantly, so posts might only show up in the category
 *    page a few minutes after being created.
 *    5. It will not work well if you try to load balance the web server.
 * 
 * I'm not very good with mysql. If anyone can think of a more efficient 
 * way to do this, please update this.
 */
// wrap in a closure to prevent global pollution
(() => {
    const sleep: (arg1: number) => Promise<void> = require('util').promisify(setTimeout);
    const data = new dal();
    let allData = new model.Categories.ForumCategories();
    const getPostsAndUpdateInternalRecords = async () => {
        // console.log('grabbing posts for all categories...');
        const setupCats = async (cat) => {
            let allPostsArr = [];
            let lastLenTest = 0;
            const addNewItemsToArray = async () => {
                // console.log('grabbing for',cat.name);
                // grab posts
                // console.log('get all threads');
                let _posts = data.knex('forum_posts').where({
                    'post_category': cat.id
                }).select('*').limit(1000).orderBy('id','desc');
                if (allPostsArr.length > 0) {
                    _posts = _posts.andWhere('id','<',allPostsArr[allPostsArr.length-1]['id'])
                }
                let posts = await _posts;
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
                    }else{
                        includedIds.push(post.id);
                        _newPosts.push(post);
                    }
                }
                // posts = _newPosts.slice(0,500);
                posts = _newPosts;

                // console.log('count all replies');
                for (const post of posts) {
                    let _grabCount = data.knex('forum_posts').count('id as total');
                    if (post.parent_thread !== 0) {
                        _grabCount = _grabCount.orWhere('parent_thread', '=', post.parent_thread);
                    } else {
                        _grabCount = _grabCount.orWhere('parent_thread', '=', post.id);
                    }
                    let grabCountResults = await _grabCount;
                    // I don't think mysql fiddles with the order (?)
                    post.reply_count = grabCountResults[0]['total'];
                }
                posts.forEach(p => {
                    allPostsArr.push(p)
                });
            }
            while (allPostsArr.length < 1000) {
                /*
                if (allPostsArr.length > 0) {
                    console.log(allPostsArr.length,'posts. trying again with offset',allPostsArr[allPostsArr.length-1]['id']);
                }
                */
                await addNewItemsToArray();
                if (lastLenTest === 0) {
                    // :(
                    break;
                }
            }
            // console.log(cat.id,'is OK');
            // console.log('Post amount OK!',allPostsArr.length);
            // console.log('setting post data');
            let didFind = false;
            for (const subCat of allPostsByCategory) {
                if (subCat.subCategoryId === cat.id) {
                    didFind = true;
                    // overwrite (or set)
                    subCat.posts = allPostsArr;
                    break;
                }
            }
            if (!didFind) {
                allPostsByCategory.push({
                    subCategoryId: cat.id,
                    posts: allPostsArr,
                })
            }
        }
        let _allPromises = [];
        for (const cat of allData.subCategories) {
            if (!cat.hidden) {
                _allPromises.push(setupCats(cat));
            }
        };
        await Promise.all(_allPromises);
    
    }
    const _getPostsSetup = async () => {
        while (true) {
            // console.log('all threads count',allPostsByCategory.length);
            try {
                await getPostsAndUpdateInternalRecords();
                await sleep(5000);
            } catch (err) {
                console.error(err);
            }
        }
    }
    _getPostsSetup();
})();

export class Forum extends dal {
    constructor() {
        super();
    }

    public async getPosts(
        limit: number = 100,
        offset?: number,
    ): Promise<any[]> {
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
        let posts = await this.knex('forum_posts').select(cols).limit(limit).orderBy('id', 'desc').offset(offset);
        return posts;
    }

    public async getPostsByCategory(
        categoryId: number,
        limit: number = 100,
        offset: number = 0,
    ): Promise<any[]> {
        if (offset >= 400) {
            return [];
        }
        // console.time('grab posts by cat');
        for (const item of allPostsByCategory) {
            if (item.subCategoryId === categoryId) {
                return item.posts.slice(offset, limit+offset);
            }
        }
        throw new Error('Query is pending or invalid categoryId');
    }

    public async getThreadByIdWithReplies(
        threadId: number,
        limit: number = 100,
        offset: number = 0,
    ) {
        let fullData = [];
        if (offset !== 0) {
            limit = limit - 1;
        }
        let remainingPosts = [];
        if (limit !== 0) {
            remainingPosts = await this.knex('forum_posts').select('*').where({
                'parent_thread': threadId,
            }).limit(limit).offset(offset);
        }

        if (offset === 0) {
            let threadInfo = await this.knex('forum_posts').select('*').where({
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
            const getUserPosts = async (id: number) => {
                let val = await this.getUserPostCount(id);
                return {
                    id: id,
                    total: val,
                }
            }
            multiGetPostCount.push(getUserPosts(p.author_id));
        });
        let postCounts = await Promise.all(multiGetPostCount);
        remainingPosts.forEach(p => {
            for (const item of postCounts) {
                if (item.id === p.author_id) {
                    p.author_postcount = item.total;
                }
            }
            fullData.push(p);
        });
        return fullData;
    }

    public async getUserPostCount(userId: number): Promise<number> {
        let posts = await this.knex('forum_posts').count('id as total').where({
            'author_id': userId,
        });
        return (posts[0]['total'] as number) || 0;
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
    public async createThread(
        title: string, 
        body: string, 
        authorUserId: number, 
        group: number, 
        category: number
    ): Promise<number> {
        let postId: number[];
        await this.knex.transaction(async (trx) => {
            let latestPost = await trx('forum_posts').select('created_at').where({
                'author_id': authorUserId,
            }).forUpdate('forum_posts').limit(1).orderBy('id','desc');
            if (latestPost[0]) {
                if (this.moment().isSameOrBefore(this.moment(latestPost[0].created_at * 1000).add(30,'seconds'))) {
                    throw new Error('Cooldown');
                }
            }
            postId = await trx('forum_posts').insert({
                'created_at': this.moment().unix(),
                'post_title': title,
                'post_body': body,
                'author_id': authorUserId,
                'author_joindate': 0, // legacy
                'author_postcount': 0, // legacy
                'post_group': group,
                'post_category': category,
                'is_moderator': 0, // legacy
                'is_top_100_poster': 0, // legacy
                'is_top_25_poster': 0, // legacy
                'is_top_50_poster': 0, // legacy
                'is_thread': 1,
                'parent_thread': 0,
            });
        });
        return postId[0] as number;
    }

    /**
     * Create a post (aka a "reply" to a threadId)
     * @param postId The ID of the post to reply to
     * @param body 
     * @param authorUserId 
     * @returns The ID of the post
     */
    public async createPost(
        postId: number,
        body: string, 
        authorUserId: number, 
    ): Promise<{postId: number; replyCount: number; expectedPage: number;}> {
        let returnPostId: number[];
        let totalReplyCountForThread: number;
        await this.knex.transaction(async (trx) => {
            let latestPost = await trx('forum_posts').select('created_at').where({
                'author_id': authorUserId,
            }).forUpdate('forum_posts').limit(1).orderBy('id','desc');
            if (latestPost[0]) {
                if (this.moment().isSameOrBefore(this.moment(latestPost[0].created_at * 1000).add(30,'seconds'))) {
                    throw new Error('Cooldown');
                }
            }
            let postToReplyTo = await trx('forum_posts').select('is_thread','parent_thread','post_title','post_group','post_category','created_at').where({
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
            }else{
                throw new Error('InvalidPostId');
            }
            returnPostId = await trx('forum_posts').insert({
                'created_at': this.moment().unix(),
                'post_title': postToReplyTo[0]['post_title'],
                'post_body': body,
                'author_id': authorUserId,
                'author_joindate': 0, // legacy
                'author_postcount': 0, // legacy
                'post_group': postToReplyTo[0]['post_group'],
                'post_category': postToReplyTo[0]['post_category'],
                'is_moderator': 0, // legacy
                'is_top_100_poster': 0, // legacy
                'is_top_25_poster': 0, // legacy
                'is_top_50_poster': 0, // legacy
                'is_thread': 0,
                'parent_thread': postId,
            });
            let totalReplyCount = await trx('forum_posts').count('id as total').where({
                'parent_thread': postId,
            })
            totalReplyCountForThread = (totalReplyCount[0]['total'] as number) + 1;
        });
        return {
            postId: returnPostId[0] as number,
            replyCount: totalReplyCountForThread,
            expectedPage: Math.ceil(totalReplyCountForThread / 25),
        };
    }

    public async countPostsForSubCategory(id: number): Promise<{posts: number; threads: number;}> {
        let posts = await this.knex('forum_posts').count('id as total').where({
            'post_category': id,
        });
        let threads = await this.knex('forum_posts').count('id as total').where('parent_thread','!=',0).andWhere({
            'post_category': id,
        });
        return {
            posts: posts[0]['total'] as number,
            threads: threads[0]['total'] as number,
        }
    }

    public async multiGetLatestPostsForSubcategory(ids: number[]): Promise<any[]> {
        let allQueries = [];
        for (const id of ids) {
            allQueries.push(this.knex('forum_posts').select('*').orderBy('id','desc').where('post_category','=',id).limit(1));
        }
        let all = await Promise.all(allQueries);
        return all;
    }

    public async contentDeletePost(id: number): Promise<void> {
        let data = await this.knex('forum_posts').select('parent_thread').where({
            'id': id,
        });
        if (data[0].parent_thread === 0) {
            // delete title from replies
            await this.knex('forum_posts').update({
                'post_title': '[ Content Deleted ]',
            }).where({
                'parent_thread': id,
            });
            // delete thread itself
            await this.knex('forum_posts').update({
                'post_title': '[ Content Deleted ]',
                'post_body': '[ Content Deleted ]',
            }).where({
                'id': id,
            });
        }else{
            // Just delete the post itself
            await this.knex('forum_posts').update({
                'post_body': '[ Content Deleted ]',
            }).where({
                'id': id,
            });
        }
        // Ok
    }
}
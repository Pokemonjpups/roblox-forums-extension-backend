import { Controller, Get, PathParams, Required, Status, QueryParams, Post, Use, Locals, BodyParams } from "@tsed/common";
import * as err from 'ts-httpexceptions';
import { Returns, Responses, Summary, Description } from "@tsed/swagger"

import _controller from './_index';
import * as middleware from '../../middleware/v1/_middleware';
import * as model from '../../models/_index';

@Controller("/posts")
export class Posts extends _controller {

    @Get('/posts')
    @Summary('Get all posts')
    public async getPosts(
        @QueryParams('limit', Number) limit?: number,
        @QueryParams('offset', Number) offset?: number,
    ) {
        return this.Forum.getPosts(limit, offset);
    }

    @Get('/:categoryId/posts')
    @Summary('Get posts for a subcategory')
    public async getPostsByCategoryId(
        @PathParams('categoryId', Number) categoryId: number,
        @QueryParams('offset', Number) offset?: number,
        @QueryParams('limit', Number) limit?: number,
    ) {
        return this.Forum.getPostsByCategory(categoryId, limit, offset);
    }

    @Get('/:postId')
    @Summary('Get post by id')
    public async getPostById(
        @PathParams('postId', Number) postId: number,
        @QueryParams('offset', Number) offset?: number,
        @QueryParams('limit', Number) limit?: number,
    ) {
        return this.Forum.getThreadByIdWithReplies(postId, limit, offset);
    }

    @Post('/thread/create')
    @Summary('Create a thread')
    @Use(middleware.Auth.LoggedIn)
    public async createThread(
        @Locals('userId') userId: number,
        @BodyParams(model.Posts.CreateThreadRequest) body: model.Posts.CreateThreadRequest,
    ) {
        let allCategories = new model.Categories.ForumCategories();
        let cat: model.Categories.ForumSubCategory;
        for (const item of allCategories.subCategories) {
            if (item.id === body.category && !item.hidden) {
                cat = item;
            }
        }
        if (!cat) {
            throw new this.BadRequest('InvalidCategoryId');
        }
        let group: model.Categories.ForumCategory;
        for (const item of allCategories.categories) {
            if (item.subCategories.includes(body.category) && !item.hidden) {
                group = item;
            }
        }
        if (!group) {
            throw new this.BadRequest('InvalidCategoryId');
        }
        // Category is OK, so create thread
        let id;
        try {
            id = await this.Forum.createThread(body.title, body.body, userId, group.id, cat.id);
        }catch(err) {
            if (err && err.message) {
                if (err.message === 'Cooldown') {
                    throw new this.BadRequest('Cooldown');
                }
            }
            throw err;
        }
        return {
            id,
        };
    }

    @Post('/:postId/post')
    @Summary('Create a post (aka a reply to a thread)')
    @Description('Note that {postId} must be a thread. Using a non-thread postId will cause an error.')
    @Use(middleware.Auth.LoggedIn)
    public async createPost(
        @Locals('userId') userId: number,
        @Required()
        @PathParams('postId', Number) postId: number,
        @BodyParams(model.Posts.CreatePostRequest) body: model.Posts.CreatePostRequest,
    ) {
        // Category is OK, so create thread
        try {
            return await this.Forum.createPost(postId, body.body, userId);
        }catch(err) {
            if (err && err.message) {
                if (err.message === 'Cooldown') {
                    throw new this.BadRequest('Cooldown');
                }else if (err.message === 'LockedThread') {
                    throw new this.Conflict('LockedThread');
                }
            }
            throw err;
        }
    }
}
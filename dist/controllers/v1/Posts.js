"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const _index_1 = require("./_index");
const middleware = require("../../middleware/v1/_middleware");
const model = require("../../models/_index");
let Posts = class Posts extends _index_1.default {
    async getPosts(limit, offset) {
        return this.Forum.getPosts(limit, offset);
    }
    async getPostsByCategoryId(categoryId, offset, limit) {
        return this.Forum.getPostsByCategory(categoryId, limit, offset);
    }
    async getPostById(postId, offset, limit) {
        return this.Forum.getThreadByIdWithReplies(postId, limit, offset);
    }
    async createThread(userId, body) {
        let allCategories = new model.Categories.ForumCategories();
        let cat;
        for (const item of allCategories.subCategories) {
            if (item.id === body.category && !item.hidden) {
                cat = item;
            }
        }
        if (!cat) {
            throw new this.BadRequest('InvalidCategoryId');
        }
        let group;
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
        }
        catch (err) {
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
    async createPost(userId, postId, body) {
        // Category is OK, so create thread
        try {
            return await this.Forum.createPost(postId, body.body, userId);
        }
        catch (err) {
            if (err && err.message) {
                if (err.message === 'Cooldown') {
                    throw new this.BadRequest('Cooldown');
                }
                else if (err.message === 'LockedThread') {
                    throw new this.Conflict('LockedThread');
                }
            }
            throw err;
        }
    }
};
__decorate([
    common_1.Get('/posts'),
    swagger_1.Summary('Get all posts'),
    __param(0, common_1.QueryParams('limit', Number)),
    __param(1, common_1.QueryParams('offset', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], Posts.prototype, "getPosts", null);
__decorate([
    common_1.Get('/:categoryId/posts'),
    swagger_1.Summary('Get posts for a subcategory'),
    __param(0, common_1.PathParams('categoryId', Number)),
    __param(1, common_1.QueryParams('offset', Number)),
    __param(2, common_1.QueryParams('limit', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], Posts.prototype, "getPostsByCategoryId", null);
__decorate([
    common_1.Get('/:postId'),
    swagger_1.Summary('Get post by id'),
    __param(0, common_1.PathParams('postId', Number)),
    __param(1, common_1.QueryParams('offset', Number)),
    __param(2, common_1.QueryParams('limit', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], Posts.prototype, "getPostById", null);
__decorate([
    common_1.Post('/thread/create'),
    swagger_1.Summary('Create a thread'),
    common_1.Use(middleware.Auth.LoggedIn),
    __param(0, common_1.Locals('userId')),
    __param(1, common_1.BodyParams(model.Posts.CreateThreadRequest)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, model.Posts.CreateThreadRequest]),
    __metadata("design:returntype", Promise)
], Posts.prototype, "createThread", null);
__decorate([
    common_1.Post('/:postId/post'),
    swagger_1.Summary('Create a post (aka a reply to a thread)'),
    swagger_1.Description('Note that {postId} must be a thread. Using a non-thread postId will cause an error.'),
    common_1.Use(middleware.Auth.LoggedIn),
    __param(0, common_1.Locals('userId')),
    __param(1, common_1.Required()),
    __param(1, common_1.PathParams('postId', Number)),
    __param(2, common_1.BodyParams(model.Posts.CreatePostRequest)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, model.Posts.CreatePostRequest]),
    __metadata("design:returntype", Promise)
], Posts.prototype, "createPost", null);
Posts = __decorate([
    common_1.Controller("/posts")
], Posts);
exports.Posts = Posts;
//# sourceMappingURL=Posts.js.map
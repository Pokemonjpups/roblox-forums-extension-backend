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
const model = require("../../models/_index");
const middleware = require("../../middleware/v1/_middleware");
const _index_1 = require("./_index");
let Moderation = class Moderation extends _index_1.default {
    async isModerator(userId) {
        let isModerator = model.Moderation.isModerator(userId);
        return {
            userId,
            isModerator,
        };
    }
    async deletePost(userId, postId) {
        let isModerator = model.Moderation.isModerator(userId);
        if (!isModerator) {
            throw new Error('Requester is not a moderator.');
        }
        // delete post
        await this.Forum.contentDeletePost(postId);
        // ok
        return {};
    }
};
__decorate([
    common_1.Post('/current-user'),
    swagger_1.Summary('Get if current user is moderator'),
    swagger_1.Returns(401, { description: 'LoginRequired: Session is invalid\n' }),
    common_1.Use(middleware.Auth.LoggedIn),
    __param(0, common_1.Locals('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], Moderation.prototype, "isModerator", null);
__decorate([
    common_1.Post('/posts/:postId/delete'),
    swagger_1.Summary('Delete a post'),
    common_1.Use(middleware.Auth.LoggedIn),
    __param(0, common_1.Locals('userId')),
    __param(1, common_1.PathParams('postId', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], Moderation.prototype, "deletePost", null);
Moderation = __decorate([
    common_1.Controller("/moderation")
], Moderation);
exports.Moderation = Moderation;
//# sourceMappingURL=Moderation.js.map
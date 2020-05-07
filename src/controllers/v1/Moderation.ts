import { Controller, Get, PathParams, Required, Status, Post, BodyParams, Res, Use, Locals } from "@tsed/common";
import * as err from 'ts-httpexceptions';
import { Returns, Responses, Summary } from "@tsed/swagger"

import * as model from '../../models/_index';
import * as middleware from '../../middleware/v1/_middleware';


import _controller from './_index';
@Controller("/moderation")
export class Moderation extends _controller {

    @Post('/current-user')
    @Summary('Get if current user is moderator')
    @Returns(401, {description: 'LoginRequired: Session is invalid\n'})
    @Use(middleware.Auth.LoggedIn)
    public async isModerator(
        @Locals('userId') userId: number,
    ) {
        let isModerator = model.Moderation.isModerator(userId);
        return {
            userId,
            isModerator,
        };
    }

    @Post('/posts/:postId/delete')
    @Summary('Delete a post')
    @Use(middleware.Auth.LoggedIn)
    public async deletePost(
        @Locals('userId') userId: number,
        @PathParams('postId', Number) postId: number,
    ) {
        let isModerator = model.Moderation.isModerator(userId);
        if (!isModerator) {
            throw new Error('Requester is not a moderator.');
        }
        // delete post
        await this.Forum.contentDeletePost(postId);
        // ok
        return {};
    }
}
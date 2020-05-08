import { Controller, Get, PathParams, Required, Status, Post, BodyParams, Res, Use, Locals } from "@tsed/common";
import * as err from 'ts-httpexceptions';
import { Returns, Responses, Summary } from "@tsed/swagger"

import * as model from '../models/_index';
import * as middleware from '../middleware/v1/_middleware';


import _controller from './v1/_index';
@Controller("/")
export class WWW extends _controller {

    @Get('/robots.txt')
    public robotstxt(
        @Res() res: Res,
    ) {
        // Why does res.set() exist if I have to use res.setHeader 99% of the time anyway?
        // ...
        // On an unrelated note, good job on the express devs for adding ";charset=utf8" to non-text content-types like "image/png"
        res.setHeader('content-type', 'text/plain');
        res.send('User-agent: *\nDisallow: /').end();
    }

    @Get('/')
    public index(
        @Res() res: Res,
    ) {
        res.setHeader('content-type', 'text/plain');
        // todo: remove this and maybe make it configurable in config.json? I don't want my email attached to random self-hosted forum projects...
        res.send(model.config.homePageText || 'Set config.homePageText to customize the text that appears on this page.').end();
    }

    @Get('/stats')
    public stats(
        @Res() res: Res,
    ) {
        res.setHeader('content-type', 'text/plain');
        res.send(`OK`).end();
    }
}
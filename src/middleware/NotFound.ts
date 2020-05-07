import { Middleware, Res, Req } from "@tsed/common";
import * as Express from "express";

@Middleware()
export class NotFoundMiddleware {
    use(
        @Req() request: Express.Request,
        @Res() response: Express.Response
    ) {
        response.status(404).json({success: false, error: {code: 'NotFound'}});
    }
}
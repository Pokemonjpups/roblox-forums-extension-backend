import { Middleware, Res, Req, Next } from "@tsed/common";
import * as Express from "express";

@Middleware()
export class RobloxCors {
    use(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
    ) {
        // yeah so chrome added CORB which broke this
        // ...
        // I'll still keep this here if some other browsers might need it...

        // response.set('access-control-allow-origin','https://www.roblox.com');
    }
}
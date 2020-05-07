import { Middleware, Header, BodyParams, Res } from "@tsed/common";

import _controller from '../../controllers/v1/_index';

@Middleware()
export class LoggedIn extends _controller {
    public async use(
        @BodyParams('auth') auth: string,
        @Res() res: Res,
    ) {
        if (!auth) {
            throw new this.Unauthorized('LoginRequired');
        }
        // Attempt to decode & verify
        try {
            let _results = this.Auth.validateSession(auth);
            // not type safe but YOLO
            res.locals['userId'] = _results.userId;
        }catch(err) {
            throw new this.Unauthorized('LoginRequired');
        }
        // OK
    }
}
import { Middleware, Res, Req, Next } from "@tsed/common";

@Middleware()
export class Pagination {
    use(
        @Req() request: Req,
        @Res() response: Res,
    ) {
        console.log('pagination');
        if (request.query['limit']) {
            let parsed = parseInt(request.query['limit'] as string, 10);
            if (parsed >= 100) {
                request.query['limit'] = '100';
            }
            if (parsed <= 1) {
                request.query['limit'] = '1';
            }
        }
    }
}
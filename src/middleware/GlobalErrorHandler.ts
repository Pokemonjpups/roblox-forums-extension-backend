import { HttpErrors } from '../helpers/HttpError';

import { Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res } from "@tsed/common";
@OverrideProvider(GlobalErrorHandlerMiddleware)
export class MyGEHMiddleware extends GlobalErrorHandlerMiddleware {

    use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        // console.log('Custom Error Handler',error,request.body,request.url);
        try {
            // DO SOMETHINGs
            if (error.name === 'BAD_REQUEST') {
                if (request.accepts('json')) {
                    let fullErrorMessage;
                    if (error.errorMessage) {
                        fullErrorMessage = {
                            location: error.requestType,
                            message: error.errorMessage.replace(/\n/g, ' '),
                            code: HttpErrors[HttpErrors.SchemaValidationFailed],
                        };
                    } else {
                        fullErrorMessage = {
                            code: HttpErrors[HttpErrors.SchemaValidationFailed],
                        }
                    }
                    if (error.message && HttpErrors[error.message]) {
                        fullErrorMessage.code = error.message;
                    }
                    return response.status(400).json({ success: false, error: fullErrorMessage })
                } else {
                    return response.status(415).json({ success: false, error: { code: HttpErrors[HttpErrors.InvalidAcceptHeader] } });
                }
            } else if (error.name === 'CONFLICT') {
                if (error.message && error.message === 'LogoutRequired') {
                    if (request.accepts('html')) {
                        return response.redirect('/');
                    }
                }
                if (request.accepts('json')) {

                    if (error.message && HttpErrors[error.message]) {
                        return response.status(409).json({ success: false, error: {code: error.message } })
                    }
                    return response.status(409).json({ success: false, error: { code: 'Conflict' } })
                } else {
                    return response.status(415).json({ success: false, error: { code: HttpErrors[HttpErrors.InvalidAcceptHeader] } });
                }
            } else if (error.name === 'NOT_FOUND') {
                if (request.accepts('json')) {
                    if (HttpErrors[error.message]) {
                        return response.status(404).json({ success: false, error: { code: error.message } });
                    }
                    return response.status(404).json({ success: false, error: { code: HttpErrors[HttpErrors.PageNotFound] } });
                } else {
                    return response.status(415).json({ success: false, error: { code: HttpErrors[HttpErrors.InvalidAcceptHeader] } });
                }
            } else if (error.name === 'UNAUTHORIZED') {
                if (request.accepts('json')) {
                    if (HttpErrors[error.message]) {
                        return response.status(401).json({ success: false, error: { code: error.message } });
                    }
                    return response.status(401).json({ success: false, error: { code: HttpErrors[HttpErrors.LoginRequired] } });
                } else {
                    return response.status(415).json({ success: false, error: { code: HttpErrors[HttpErrors.InvalidAcceptHeader] } });
                }
            } else {

            }
        } catch (e) {
            // Log exception
        }

        console.log(error);
        // require('fs').writeFileSync('./logs.txt', JSON.stringify(serializeError(error)));
        // default if internal error / something goes wrong in error handler
        if (request.accepts('json')) {
            return response.status(500).json({ success: false, error: { code: HttpErrors[HttpErrors.InternalServerError] } });
        } else {
            return response.status(415).json({ success: false, error: { code: HttpErrors[HttpErrors.InvalidAcceptHeader] } });
        }
        // this exposes stack trace, so do not uncomment
        // return super.use(error, request, response);
    }
}
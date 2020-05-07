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
const HttpError_1 = require("../helpers/HttpError");
const common_1 = require("@tsed/common");
let MyGEHMiddleware = class MyGEHMiddleware extends common_1.GlobalErrorHandlerMiddleware {
    use(error, request, response) {
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
                            code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.SchemaValidationFailed],
                        };
                    }
                    else {
                        fullErrorMessage = {
                            code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.SchemaValidationFailed],
                        };
                    }
                    if (error.message && HttpError_1.HttpErrors[error.message]) {
                        fullErrorMessage.code = error.message;
                    }
                    return response.status(400).json({ success: false, error: fullErrorMessage });
                }
                else {
                    return response.status(415).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InvalidAcceptHeader] } });
                }
            }
            else if (error.name === 'CONFLICT') {
                if (error.message && error.message === 'LogoutRequired') {
                    if (request.accepts('html')) {
                        return response.redirect('/');
                    }
                }
                if (request.accepts('json')) {
                    if (error.message && HttpError_1.HttpErrors[error.message]) {
                        return response.status(409).json({ success: false, error: { code: error.message } });
                    }
                    return response.status(409).json({ success: false, error: { code: 'Conflict' } });
                }
                else {
                    return response.status(415).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InvalidAcceptHeader] } });
                }
            }
            else if (error.name === 'NOT_FOUND') {
                if (request.accepts('json')) {
                    if (HttpError_1.HttpErrors[error.message]) {
                        return response.status(404).json({ success: false, error: { code: error.message } });
                    }
                    return response.status(404).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.PageNotFound] } });
                }
                else {
                    return response.status(415).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InvalidAcceptHeader] } });
                }
            }
            else if (error.name === 'UNAUTHORIZED') {
                if (request.accepts('json')) {
                    if (HttpError_1.HttpErrors[error.message]) {
                        return response.status(401).json({ success: false, error: { code: error.message } });
                    }
                    return response.status(401).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.LoginRequired] } });
                }
                else {
                    return response.status(415).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InvalidAcceptHeader] } });
                }
            }
            else {
            }
        }
        catch (e) {
            // Log exception
        }
        console.log(error);
        // require('fs').writeFileSync('./logs.txt', JSON.stringify(serializeError(error)));
        // default if internal error / something goes wrong in error handler
        if (request.accepts('json')) {
            return response.status(500).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InternalServerError] } });
        }
        else {
            return response.status(415).json({ success: false, error: { code: HttpError_1.HttpErrors[HttpError_1.HttpErrors.InvalidAcceptHeader] } });
        }
        // this exposes stack trace, so do not uncomment
        // return super.use(error, request, response);
    }
};
__decorate([
    __param(0, common_1.Err()), __param(1, common_1.Req()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], MyGEHMiddleware.prototype, "use", null);
MyGEHMiddleware = __decorate([
    common_1.OverrideProvider(common_1.GlobalErrorHandlerMiddleware)
], MyGEHMiddleware);
exports.MyGEHMiddleware = MyGEHMiddleware;
//# sourceMappingURL=GlobalErrorHandler.js.map
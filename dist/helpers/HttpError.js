"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpErrors;
(function (HttpErrors) {
    HttpErrors[HttpErrors["InternalServerError"] = 0] = "InternalServerError";
    HttpErrors[HttpErrors["InvalidAcceptHeader"] = 1] = "InvalidAcceptHeader";
    HttpErrors[HttpErrors["PageNotFound"] = 2] = "PageNotFound";
    HttpErrors[HttpErrors["LoginRequired"] = 3] = "LoginRequired";
    HttpErrors[HttpErrors["LogoutRequire"] = 4] = "LogoutRequire";
    HttpErrors[HttpErrors["SchemaValidationFailed"] = 5] = "SchemaValidationFailed";
    HttpErrors[HttpErrors["Cooldown"] = 6] = "Cooldown";
    HttpErrors[HttpErrors["LockedThread"] = 7] = "LockedThread";
})(HttpErrors = exports.HttpErrors || (exports.HttpErrors = {}));
;
//# sourceMappingURL=HttpError.js.map
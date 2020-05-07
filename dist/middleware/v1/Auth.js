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
const _index_1 = require("../../controllers/v1/_index");
let LoggedIn = class LoggedIn extends _index_1.default {
    async use(auth, res) {
        if (!auth) {
            throw new this.Unauthorized('LoginRequired');
        }
        // Attempt to decode & verify
        try {
            let _results = this.Auth.validateSession(auth);
            // not type safe but YOLO
            res.locals['userId'] = _results.userId;
        }
        catch (err) {
            throw new this.Unauthorized('LoginRequired');
        }
        // OK
    }
};
__decorate([
    __param(0, common_1.BodyParams('auth')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoggedIn.prototype, "use", null);
LoggedIn = __decorate([
    common_1.Middleware()
], LoggedIn);
exports.LoggedIn = LoggedIn;
//# sourceMappingURL=Auth.js.map
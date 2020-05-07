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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
class UserInfo {
}
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], UserInfo.prototype, "description", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], UserInfo.prototype, "created", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "isBanned", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", Number)
], UserInfo.prototype, "id", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], UserInfo.prototype, "name", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], UserInfo.prototype, "displayName", void 0);
exports.UserInfo = UserInfo;
class ILoginToken {
}
exports.ILoginToken = ILoginToken;
class ILoginSession {
}
exports.ILoginSession = ILoginSession;
//# sourceMappingURL=auth.js.map
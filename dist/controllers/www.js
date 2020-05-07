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
const _index_1 = require("./v1/_index");
let WWW = class WWW extends _index_1.default {
    robotstxt(res) {
        // Why does res.set() exist if I have to use res.setHeader 99% of the time anyway?
        // ...
        // On an unrelated note, good job on the express devs for adding ";charset=utf8" to non-text content-types like "image/png"
        res.setHeader('content-type', 'text/plain');
        res.send('User-agent: *\nDisallow: /').end();
    }
    index(res) {
        res.setHeader('content-type', 'text/plain');
        res.send(`This is an endpoint used for the unofficial roblox forums browser extension by beak.\n\nTo report abusive content or to contact the operator of this service, please send an email to forums-project@beak.dev and allow up to 2 weeks for a response (if any). Unofficial Roblox Forums is not sponsored, endorsed, or in any way related to Roblox corperation.`).end();
    }
    stats(res) {
        res.setHeader('content-type', 'text/plain');
        res.send(`OK`).end();
    }
};
__decorate([
    common_1.Get('/robots.txt'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WWW.prototype, "robotstxt", null);
__decorate([
    common_1.Get('/'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WWW.prototype, "index", null);
__decorate([
    common_1.Get('/stats'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WWW.prototype, "stats", null);
WWW = __decorate([
    common_1.Controller("/")
], WWW);
exports.WWW = WWW;
//# sourceMappingURL=www.js.map
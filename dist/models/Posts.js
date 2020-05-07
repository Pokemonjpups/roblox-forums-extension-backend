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
class CreateThreadRequest {
}
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], CreateThreadRequest.prototype, "auth", void 0);
__decorate([
    common_1.Required(),
    common_1.MinLength(1),
    common_1.MaxLength(64),
    __metadata("design:type", String)
], CreateThreadRequest.prototype, "title", void 0);
__decorate([
    common_1.Required(),
    common_1.MinLength(4),
    common_1.MaxLength(4096),
    __metadata("design:type", String)
], CreateThreadRequest.prototype, "body", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", Number)
], CreateThreadRequest.prototype, "category", void 0);
exports.CreateThreadRequest = CreateThreadRequest;
class CreatePostRequest {
}
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], CreatePostRequest.prototype, "auth", void 0);
__decorate([
    common_1.Required(),
    common_1.MinLength(4),
    common_1.MaxLength(4096),
    __metadata("design:type", String)
], CreatePostRequest.prototype, "body", void 0);
exports.CreatePostRequest = CreatePostRequest;
//# sourceMappingURL=Posts.js.map
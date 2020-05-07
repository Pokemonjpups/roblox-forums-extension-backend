"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forum_1 = require("../../dal/forum");
const auth_1 = require("../../dal/auth");
const ts_httpexceptions_1 = require("ts-httpexceptions");
class Controller {
    constructor() {
        this.Forum = new forum_1.Forum();
        this.Auth = new auth_1.Auth();
        this.BadRequest = ts_httpexceptions_1.BadRequest;
        this.Conflict = ts_httpexceptions_1.Conflict;
        this.Unauthorized = ts_httpexceptions_1.Unauthorized;
    }
}
exports.default = Controller;
//# sourceMappingURL=_index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("./_index");
class Auth extends _index_1.default {
    constructor() {
        super();
    }
    async getUserById(userId) {
        let info = await this.axios.get('https://users.roblox.com/v1/users/' + userId.toString());
        return info.data;
    }
    generateAuthTokenForLogin(userId, randomCode) {
        return this.jwt.sign({
            isLoginToken: true,
            userId: userId,
            code: randomCode,
        }, this.config.jwt.login);
    }
    validateTokenProvidedForLogin(randomCode) {
        let result = this.jwt.verify(randomCode, this.config.jwt.login);
        if (result.isLoginToken !== true) {
            throw new Error('Token provided is not valid');
        }
        if (this.moment(result.iat * 1000).isSameOrAfter(this.moment().add(1, 'minutes'))) {
            throw new Error('Expired token');
        }
        return result;
    }
    async generateTokenForSession(userId) {
        return this.jwt.sign({
            isAuthToken: true,
            userId: userId,
        }, this.config.jwt.session);
    }
    validateSession(sessionStr) {
        let result = this.jwt.verify(sessionStr, this.config.jwt.session);
        if (result.isAuthToken !== true) {
            throw new Error('Token provided is not valid');
        }
        if (this.moment(result.iat * 1000).isSameOrAfter(this.moment().add(6, 'months'))) {
            throw new Error('Expired token');
        }
        return result;
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map
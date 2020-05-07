import dal from './_index';
import * as model from '../models/_index';

export class Auth extends dal {
    constructor() {
        super();
    }

    public async getUserById(userId: number): Promise<model.Auth.UserInfo> {
        let info = await this.axios.get('https://users.roblox.com/v1/users/'+userId.toString());
        return info.data;
    }

    public generateAuthTokenForLogin(userId: number, randomCode: string): string {
        return this.jwt.sign({
            isLoginToken: true,
            userId: userId,
            code: randomCode,
        }, this.config.jwt.login);
    }

    public validateTokenProvidedForLogin(randomCode: string): model.Auth.ILoginToken {
        let result: any = this.jwt.verify(randomCode, this.config.jwt.login);
        if (result.isLoginToken !== true) {
            throw new Error('Token provided is not valid');
        }
        if (this.moment(result.iat * 1000).isSameOrAfter(this.moment().add(1, 'minutes'))) {
            throw new Error('Expired token');
        }
        return result as any;
    }

    public async generateTokenForSession(userId: number): Promise<string> {
        return this.jwt.sign({
            isAuthToken: true,
            userId: userId,
        }, this.config.jwt.session);
    }

    public validateSession(sessionStr: string): model.Auth.ILoginSession {
        let result: any = this.jwt.verify(sessionStr, this.config.jwt.session);
        if (result.isAuthToken !== true) {
            throw new Error('Token provided is not valid');
        }
        if (this.moment(result.iat * 1000).isSameOrAfter(this.moment().add(6, 'months'))) {
            throw new Error('Expired token');
        }
        return result as any;
    }
}
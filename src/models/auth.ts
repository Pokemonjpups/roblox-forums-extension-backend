import { Required } from "@tsed/common";

export class UserInfo {
    @Required()
    description: string;
    @Required()
    created: string;
    @Required()
    isBanned: boolean;
    @Required()
    id: number;
    @Required()
    name: string;
    @Required()
    displayName: string;
}

export class ILoginToken {
    isLoginToken: true; 
    userId: number; 
    code: string; 
    iat: number;
}

export class ILoginSession {
    isAuthToken: boolean;
    userId: number;
}
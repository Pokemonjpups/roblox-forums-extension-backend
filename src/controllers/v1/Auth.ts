import { Controller, Get, PathParams, Required, Status, Post, BodyParams, Res, Use, Locals } from "@tsed/common";
import * as err from 'ts-httpexceptions';
import { Returns, Responses, Summary } from "@tsed/swagger"

import * as model from '../../models/_index';
import * as middleware from '../../middleware/v1/_middleware';


import _controller from './_index';
@Controller("/auth")
export class Auth extends _controller {

    @Post('/current-user')
    @Summary('Get current userId')
    @Returns(401, {description: 'LoginRequired: Session is invalid\n'})
    @Use(middleware.Auth.LoggedIn)
    public async validateSession(
        @Locals('userId') userId: number,
    ) {
        return {
            userId: userId,
        };
    }

    @Post('/login/generate-token')
    @Summary('Generate login token')
    public async generateLoginToken(
        @Required()
        @BodyParams('userId', Number) userId: number,
    ) {
        // Verify username is valid
        let userInfo: model.Auth.UserInfo;
        try {
            userInfo = await this.Auth.getUserById(userId);
        } catch (e) {
            throw new this.BadRequest('InvalidUserId');
        }
        const possibleWordsForCode = [
            'Dog',
            'Cat',
            'Horse',
            'Donkey',
            'Machine',
            'Computer',
            'Tablet',
            'Phone',
            'Desktop',
            'Desk',
            'Air Conditioner',
            'Beak',
            'Trade',
            'Trading',
            'Food',
            'Orange',
            'Apple',
            'Pear',
            'Fire',
            'Water',
            'Ice',
            'Craft',
            'Mine',
            'Time',
            'Clock',
            'Watch',
            'Mouse',
            'House',
            'Keyboard',
            'Chair',
            'Microwave',
            'Oven',
            'Couch',
            'Table',
            'Fan',
            'Television',
            'Piano',
            'Guitar',
            'Drums',
            'Sticks',
            'Stones',
            'Steel',
            'Green',
            'Blue',
            'Yellow',
            'Orange',
            'Teal',
            'Spark',
            'Thunder',
            'Lighting',
            'Rain',
            'Snow',
            'Sun',
            'Cloud',
            'Clouds',
            'Tables',
            'Pianos',
            'Fans',
            'Couches',
            'Ovens',
            'Microwaves',
            'Pears',
            'Apples',
            'Oranges',
            'Phones',
            'Televisions',
            'Drive',
            'Car',
            'Cars',
            'Van',
            'Vans',
        ];
        const generateCode = (): string => {
            let n = 10;
            var result = new Array(n),
                len = possibleWordsForCode.length,
                taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = possibleWordsForCode[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            let returnStr = '';
            for (const el of result) {
                returnStr += ' ' + el;
            }
            returnStr = returnStr.slice(1);
            return returnStr;
        }
        const code = generateCode();
        let token = this.Auth.generateAuthTokenForLogin(userInfo.id, code);
        return {
            token: token,
            string: code,
        };
    }

    @Post('/login')
    @Summary('Login to your account using the generated authToken')
    @Returns(400, {type: Error, description: 'InvalidAuthToken: Authtoken is expired or invalid\n'})
    @Returns(409, {type: Error, description: 'CodeNotFoundOnProfile: Code could not be located on profile\n'})
    public async login(
        @Required()
        @BodyParams('authToken', String) authToken: string,
    ) {
        let verifyToken: model.Auth.ILoginToken;
        try {
            verifyToken = this.Auth.validateTokenProvidedForLogin(authToken);
        }catch(e) {
            console.log(e);
            throw new this.BadRequest('InvalidAuthToken');
        }
        let codeToCheckFor = verifyToken.code;
        let userProfile = await this.Auth.getUserById(verifyToken.userId)
        let desc = userProfile.description as string;
        if (desc.match(new RegExp(codeToCheckFor))) {
            // Make session token
            let sessionToken = await this.Auth.generateTokenForSession(verifyToken.userId);
            return {
                success: true,
                userId: userProfile.id,
                session: sessionToken,
            };
        }else{
            console.log(desc);
            throw new this.Conflict('CodeNotFoundOnProfile');
        }
    }
}
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const middleware = require("../../middleware/v1/_middleware");
const _index_1 = require("./_index");
let Auth = class Auth extends _index_1.default {
    validateSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                userId: userId,
            };
        });
    }
    generateLoginToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify username is valid
            let userInfo;
            try {
                userInfo = yield this.Auth.getUserById(userId);
            }
            catch (e) {
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
            const generateCode = () => {
                let n = 10;
                var result = new Array(n), len = possibleWordsForCode.length, taken = new Array(len);
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
            };
            const code = generateCode();
            let token = this.Auth.generateAuthTokenForLogin(userInfo.id, code);
            return {
                token: token,
                string: code,
            };
        });
    }
    login(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let verifyToken;
            try {
                verifyToken = this.Auth.validateTokenProvidedForLogin(authToken);
            }
            catch (e) {
                console.log(e);
                throw new this.BadRequest('InvalidAuthToken');
            }
            let codeToCheckFor = verifyToken.code;
            let userProfile = yield this.Auth.getUserById(verifyToken.userId);
            let desc = userProfile.description;
            if (desc.match(new RegExp(codeToCheckFor))) {
                // Make session token
                let sessionToken = yield this.Auth.generateTokenForSession(verifyToken.userId);
                return {
                    success: true,
                    userId: userProfile.id,
                    session: sessionToken,
                };
            }
            else {
                console.log(desc);
                throw new this.Conflict('CodeNotFoundOnProfile');
            }
        });
    }
};
__decorate([
    common_1.Post('/current-user'),
    swagger_1.Summary('Get current userId'),
    swagger_1.Returns(401, { description: 'LoginRequired: Session is invalid\n' }),
    common_1.Use(middleware.Auth.LoggedIn),
    __param(0, common_1.Locals('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "validateSession", null);
__decorate([
    common_1.Post('/login/generate-token'),
    swagger_1.Summary('Generate login token'),
    __param(0, common_1.Required()),
    __param(0, common_1.BodyParams('userId', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "generateLoginToken", null);
__decorate([
    common_1.Post('/login'),
    swagger_1.Summary('Login to your account using the generated authToken'),
    swagger_1.Returns(400, { type: Error, description: 'InvalidAuthToken: Authtoken is expired or invalid\n' }),
    swagger_1.Returns(409, { type: Error, description: 'CodeNotFoundOnProfile: Code could not be located on profile\n' }),
    __param(0, common_1.Required()),
    __param(0, common_1.BodyParams('authToken', String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "login", null);
Auth = __decorate([
    common_1.Controller("/auth")
], Auth);
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map
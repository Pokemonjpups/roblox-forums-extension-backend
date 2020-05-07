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
const swagger_1 = require("@tsed/swagger");
class ForumCategory {
}
__decorate([
    common_1.Required(),
    __metadata("design:type", Number)
], ForumCategory.prototype, "id", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], ForumCategory.prototype, "name", void 0);
__decorate([
    common_1.Required(),
    common_1.PropertyType(Number),
    __metadata("design:type", Array)
], ForumCategory.prototype, "subCategories", void 0);
__decorate([
    common_1.Required(),
    swagger_1.Description('If true, this category cannot be posted to. It can still be viewed, but will not be visible on the homepage'),
    __metadata("design:type", Boolean)
], ForumCategory.prototype, "hidden", void 0);
exports.ForumCategory = ForumCategory;
class ForumSubCategory {
}
__decorate([
    common_1.Required(),
    __metadata("design:type", Number)
], ForumSubCategory.prototype, "id", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], ForumSubCategory.prototype, "name", void 0);
__decorate([
    common_1.Required(),
    __metadata("design:type", String)
], ForumSubCategory.prototype, "description", void 0);
__decorate([
    common_1.Required(),
    swagger_1.Description('If true, this subcategory cannot be posted to. It can still be viewed, but will not be visible on the homepage'),
    __metadata("design:type", Boolean)
], ForumSubCategory.prototype, "hidden", void 0);
exports.ForumSubCategory = ForumSubCategory;
class ForumCategories {
    constructor() {
        this.categories = [
            {
                id: 10,
                name: 'Roblox',
                subCategories: [
                    65,
                    46,
                    14,
                    21,
                    54,
                    43,
                    47,
                    44,
                ],
                hidden: false,
            },
            {
                id: 20,
                name: 'Club Houses',
                subCategories: [
                    13,
                    18,
                    32,
                    35,
                    45,
                ],
                hidden: false,
            },
            {
                id: 30,
                name: 'Game Creation and Development',
                subCategories: [
                    62,
                    40,
                    33,
                    20,
                    19,
                    39,
                    37,
                    41,
                    28,
                    36,
                    16,
                ],
                hidden: false,
            },
            {
                id: 40,
                name: 'Entertainment',
                subCategories: [
                    42,
                    52,
                    26,
                    24,
                    23,
                    25,
                    38,
                ],
                hidden: true,
            },
            {
                id: 50,
                name: 'Roblox Fun',
                subCategories: [
                    29,
                    22,
                    27,
                    17,
                ],
                hidden: true,
            },
            {
                id: 60,
                name: 'Roblox Global',
                subCategories: [
                    31,
                    30,
                ],
                hidden: true,
            }
        ];
        this.subCategories = [
            {
                id: 65,
                name: "Roblox News & Discussion",
                description: 'Discuss official Roblox news.',
                hidden: false,
            },
            {
                id: 46,
                name: 'All Things Roblox',
                description: 'The area for discussions purely about Roblox – the features, the games, and company news.',
                hidden: false,
            },
            {
                id: 14,
                name: 'Help',
                description: 'Seeking account or technical help? Post your questions here.',
                hidden: false,
            },
            {
                id: 21,
                name: 'Suggestions & Ideas',
                description: 'Do you have a suggestion and ideas for Roblox? Share your feedback here.',
                hidden: false,
            },
            {
                id: 54,
                name: 'BloxFaires & Roblox Events',
                description: 'Check here to see the crazy things Roblox is doing. Contest information can be found here. Roblox is going to be at various Maker Faires and conferences around the globe. Discuss those events here!',
                hidden: true,
            },
            {
                id: 43,
                name: 'Roblox Events & Contests',
                description: 'Get involved with Roblox Event and Contests! We\'re discussing ongoing and future events and contests in this forum.',
                hidden: true,
            },
            {
                id: 47,
                name: 'Bloxcon 2013',
                description: 'Bloxcon is the real world gathering of Roblox staff and fans, where building, playing, learning and making friends are the priorities of the day.',
                hidden: true,
            },
            {
                id: 44,
                name: 'I Made That',
                description: 'Calling all creative Robloxians! Model builders, clothing creators, decal artists and re-texturers - this is your forum.',
                hidden: true,
            },
            {
                id: 13,
                name: 'Roblox Talk',
                description: 'A popular hangout where Robloxians talk about various topics.',
                hidden: false,
            },
            {
                id: 18,
                name: 'Off Topic',
                description: 'When no other forum makes sense for your post, Off Topic will help it make even less sense.',
                hidden: false,
            },
            {
                id: 32,
                name: 'Clans & Guilds',
                description: 'Talk about what’s going on in your Clans, Groups, Companies, and Guilds, and about the Groups feature in general.',
                hidden: false,
            },
            {
                id: 35,
                name: 'Let\'s Make a Deal',
                description: 'A fast paced community dedicated to mastering the Limited Trades and Sales market, and divining the subtleties of the Roblox Currency Exchange.',
                hidden: false,
            },
            {
                id: 45,
                name: 'Global Chat',
                description: 'This forum is the place to discuss the country you are from, world travel, find online pen pals.',
                hidden: true,
            },
            {
                id: 62,
                name: 'Game Marketing',
                description: 'This is where you show off your awesome creations, talk about how to advertise your game or share your marketing and sale tactics.',
                hidden: false,
            },
            {
                id: 40,
                name: 'Game Design',
                description: 'This is the forum to get help, talk about future Roblox game ideas, or gather an awesome building team.',
                hidden: false,
            },
            {
                id: 33,
                name: 'Scripters',
                description: 'This is the place for discussion about scripting. Anything about scripting that is not a help request or topic belongs here.',
                hidden: false,
            },
            {
                id: 20,
                name: 'Scripting Helpers',
                description: 'Need help with a script you are writing? Need to edit an existing script? This is the place to share your 1337 Lua programming skills and help others.',
                hidden: false,
            },
            {
                id: 19,
                name: 'Building Helpers',
                description: 'Learn the ins and outs of building structures in Roblox. Share your techniques with other builders, discuss designs, and draft plans. Help others!',
                hidden: true,
            },
            {
                id: 39,
                name: 'Roblox Studio',
                description: 'This is the place to post about Roblox Studio for Mac and Windows.',
                hidden: true,
            },
            {
                id: 37,
                name: 'Game Test',
                description: 'This is the place to post about www.gametest1.roblox.com about the Roblox game and Studio.',
                hidden: true,
            },
            {
                id: 41,
                name: 'Roblox Mobile',
                description: 'Discuss mobile versions of the Roblox website, the iPhone app, and playing Roblox on the iPad.',
                hidden: true,
            },
            {
                id: 28,
                name: 'Roblox Testing',
                description: 'This is the place to talk about the exciting stuff going on with the Roblox Test servers. Official news about testing will be posted here. All topics about the Test servers belong in this forum.',
                hidden: true,
            },
            {
                id: 36,
                name: 'Website Test',
                description: 'Post about sitetest.roblox.com about Roblox website features here.',
                hidden: true,
            },
            {
                id: 16,
                name: 'Release Notes',
                description: 'Information on the latest Roblox releases.',
                hidden: true,
            },
            {
                id: 42,
                name: 'Video Game Central',
                description: 'Talk about your favorite video and computer games outside of Roblox, with other fanatical video gamers!',
                hidden: true,
            },
            {
                id: 52,
                name: 'Video Creations with Roblox',
                description: 'This forum is for your sweet game play footage or that awesome viral video you saw on YouTube. Also to talk about your favorite Twitch streamers.',
                hidden: true,
            },
            {
                id: 26,
                name: 'Ro-Sports',
                description: 'For the many leagues of Roblox sports, real life sports fans.',
                hidden: true,
            },
            {
                id: 24,
                name: 'Pop-Culture',
                description: 'Come here to find what Robloxians think is a must read, see or hear.',
                hidden: true,
            },
            {
                id: 23,
                name: 'Role-Playing',
                description: 'The forum for story telling and imagination. Start a role-playing thread here involving your fictional characters, or role-play out a scenario with other players.',
                hidden: true,
            },
            {
                id: 25,
                name: 'Movies/TV/Books',
                description: 'Does your Robloxian belong on the silver screen, or in the pages of a novel? Show off your Roblox movie star, discuss your favorite TV series, films, and the books you love.',
                hidden: true,
            },
            {
                id: 38,
                name: 'Forum Games',
                description: 'Post your most hilarious forum games here. Who\'s the best at typing with their elbows? Give gifts to the person above you. Play classic forum games and make up new ones!',
                hidden: true,
            },
            {
                id: 29,
                name: 'Hi, I\'m New',
                description: 'Introduce yourself to the Roblox community. Welcome new users here, make new friends!',
                hidden: true,
            },
            {
                id: 22,
                name: 'Rate My Robloxian',
                description: 'Show the world of Roblox your character. Get feedback on your outfit.',
                hidden: true,
            },
            {
                id: 27,
                name: 'Robloxiwood',
                description: 'The forum for movie-makers!',
                hidden: true,
            },
            {
                id: 17,
                name: 'Look What I Made',
                description: 'Discuss your Roblox creations and share the secrets of your success. Post requests for help building and scripting here.',
                hidden: true,
            },
            {
                id: 31,
                name: 'Language Center',
                description: 'Robloxians know many languages. This is the place to talk about how all the languages come together in Robloxia!',
                hidden: true,
            },
            {
                id: 30,
                name: 'World Wide Chat',
                description: 'This is the place to talk to players from your country, or make new friends from other countries! Everyone is welcome.',
                hidden: true,
            }
        ];
    }
}
__decorate([
    common_1.Required(),
    common_1.PropertyType(ForumCategory),
    __metadata("design:type", Array)
], ForumCategories.prototype, "categories", void 0);
__decorate([
    common_1.Required(),
    common_1.PropertyType(ForumSubCategory),
    __metadata("design:type", Array)
], ForumCategories.prototype, "subCategories", void 0);
exports.ForumCategories = ForumCategories;
class LatestPost {
}
class ForumSubCategoryWithCount extends ForumSubCategory {
}
__decorate([
    common_1.AllowTypes('number'),
    __metadata("design:type", Number)
], ForumSubCategoryWithCount.prototype, "post_count", void 0);
__decorate([
    common_1.AllowTypes('number'),
    __metadata("design:type", Number)
], ForumSubCategoryWithCount.prototype, "thread_count", void 0);
class ForumCategoriesWithSubCounts extends ForumCategories {
}
exports.ForumCategoriesWithSubCounts = ForumCategoriesWithSubCounts;
//# sourceMappingURL=Categories.js.map
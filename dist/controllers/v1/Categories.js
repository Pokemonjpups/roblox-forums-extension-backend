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
const model = require("../../models/_index");
const _index_1 = require("./_index");
let Categories = class Categories extends _index_1.default {
    constructor() {
        super();
        this.subCategoryInfo = new model.Categories.ForumCategories();
        // "cron" jobs
        this.updateSubCategoryInfo();
        this.updateSubcategoryLatestPost();
    }
    async updateSubCategoryInfo() {
        while (true) {
            try {
                let allProms = [];
                for (const item of this.subCategoryInfo.subCategories) {
                    if (!item.hidden) {
                        const updateCat = async (item) => {
                            // grab post count
                            // console.log('counting posts/threads');
                            let postCount = await this.Forum.countPostsForSubCategory(item.id);
                            item.post_count = postCount.posts;
                            item.thread_count = postCount.threads;
                        };
                        allProms.push(updateCat(item));
                    }
                }
                await Promise.all(allProms);
                console.log('update complete.');
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    async updateSubcategoryLatestPost() {
        while (true) {
            try {
                // console.log('begin get latest');
                let allids = [];
                this.subCategoryInfo.subCategories.forEach(cat => {
                    if (!cat.hidden) {
                        allids.push(cat.id);
                    }
                });
                let allPosts = await this.Forum.multiGetLatestPostsForSubcategory(allids);
                for (const postArr of allPosts) {
                    let post = postArr[0];
                    if (!post) {
                        continue; // uhh...
                    }
                    for (const cat of this.subCategoryInfo.subCategories) {
                        if (post.post_category === cat.id) {
                            cat.latest_post = post;
                        }
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            await require('util').promisify(setTimeout)(2500);
        }
    }
    categories() {
        return this.subCategoryInfo;
    }
};
__decorate([
    common_1.Get('/all'),
    swagger_1.Summary('Get all categories'),
    swagger_1.Returns(200, { type: model.Categories.ForumCategoriesWithSubCounts }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Categories.prototype, "categories", null);
Categories = __decorate([
    common_1.Controller("/categories"),
    __metadata("design:paramtypes", [])
], Categories);
exports.Categories = Categories;
//# sourceMappingURL=Categories.js.map
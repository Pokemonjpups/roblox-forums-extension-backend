import { Controller, Get, PathParams, Required, Status } from "@tsed/common";
import * as err from 'ts-httpexceptions';
import { Returns, Responses, Summary } from "@tsed/swagger"

import * as model from '../../models/_index';

import _controller from './_index';
@Controller("/categories")
export class Categories extends _controller {

    constructor() {
        super();
        // "cron" jobs
        this.updateSubCategoryInfo();
        this.updateSubcategoryLatestPost();
    }

    public subCategoryInfo: model.Categories.ForumCategoriesWithSubCounts = new model.Categories.ForumCategories();
    public async updateSubCategoryInfo() {
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
                        }
                        allProms.push(updateCat(item));
                    }
                }
                await Promise.all(allProms);
                console.log('update complete.');
            }catch(err) {
                console.error(err);
            }
        }
    }

    public async updateSubcategoryLatestPost() {
        while (true) {
            try {
                // console.log('begin get latest');
                let allids = [];
                this.subCategoryInfo.subCategories.forEach(cat => {
                    if (!cat.hidden) {
                        allids.push(cat.id);
                    }
                })
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
            }catch(err) {
                console.error(err);
            }
            await require('util').promisify(setTimeout)(2500);
        }
    }

    @Get('/all')
    @Summary('Get all categories')
    @Returns(200, {type: model.Categories.ForumCategoriesWithSubCounts})
    public categories() {
        return this.subCategoryInfo;
    }
}
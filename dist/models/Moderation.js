"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// todo: move this to database or something
exports.ModeratorUserIds = [
    1,
    1335179568,
    1339020939,
];
exports.isModerator = (userId) => {
    for (const item of exports.ModeratorUserIds) {
        if (item === userId) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=Moderation.js.map
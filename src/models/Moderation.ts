// todo: move this to database or something
export const ModeratorUserIds = [
    1,
    1335179568,
    1339020939,
];

export const isModerator = (userId: number): boolean => {
    for (const item of ModeratorUserIds) {
        if (item === userId) {
            return true;
        }
    }
    return false;
}
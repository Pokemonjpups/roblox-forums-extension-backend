const fs = require('fs-extra');
const childProcess = require('child_process');

try {
    // Remove current build
    // fs.removeSync('./dist/');
    let distDir;
    try {
        distDir = fs.readdirSync('./dist/');
    }catch{
        // does not exist, so make it
        fs.mkdirSync('./dist/');
        // re-assign to empty array
        distDir = [];
    }
    // make public dir if not exists
    try {
        fs.readdirSync('./dist/public/')
    }catch{
        // does not exist, so make it
        fs.mkdirSync('./dist/public/');
    }
    for (const file of distDir) {
        if (file === 'public') {continue;}
        fs.removeSync('./dist/'+file);
    }
    // Copy front-end files
    // fs.copySync('./src/public', './dist/public');
    // fs.copySync('./src/views', './dist/views');
    // Transpile the typescript files
    childProcess.exec('tsc --build tsconfig.json', async (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }else if (stderr) {
            console.log(stderr);
        }else{
            // config istanbul ignore
            // const ignore = require('istanbul-ignore-ts-__decorate');
            // await ignore({folder: '../dist/'});
            console.log(stdout);
        }
    });
} catch (err) {
    console.log(err);
}

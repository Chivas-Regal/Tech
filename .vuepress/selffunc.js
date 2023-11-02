
const { readdirSync } = require('fs');
const { join } = require('path');

exports.mGetChildren = function(folderPath) {
    const fileNames = [];
    const files = readdirSync(folderPath);
    
    files.forEach(file => {
        const filePath = join(folderPath, file);
        fileNames.push(folderPath.slice(1) + '/' + file);
    });
    
    return fileNames;
}
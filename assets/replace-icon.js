 //requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(__dirname, 'mimetypes-icons-scalable');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
//         console.log(file);
        let content = fs.readFileSync(path.resolve(directoryPath, file), 'utf-8')
        if (content.startsWith('./')) {
            let anotherFilename = content.trim().slice(2).trim()
            if (fs.existsSync(path.resolve(directoryPath, anotherFilename))) {
                let anotherFileContent = fs.readFileSync(path.resolve(directoryPath, anotherFilename), 'utf-8')
                fs.writeFileSync(path.resolve(directoryPath, file), anotherFileContent, 'utf-8')
            }
//             console.log(file, content.length)
        }
    });
});

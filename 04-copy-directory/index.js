const path = require('path');
const fs = require('fs');

const resolvedPath = path.resolve(__dirname);

const folderName = path.join(resolvedPath, 'files-copy');
const filesFolderName = path.join(resolvedPath, 'files');

// check if the folder exists, if not - create the folder
fs.access(folderName, (error) => {
  if (error) {
    console.log("Directory does not exist.");
    fs.mkdir(folderName, { recursive: true }, (err) => {
      if (err) throw err;
    });
  } else {
    console.log("Directory exists.");
  }
})

fs.readdir(filesFolderName, (err, files) => {
  if (err) throw err;
    
  for (let file of files) {
    let fileSorceName = path.join(resolvedPath, 'files', file);
    let fileDestinationName = path.join(folderName, file);

    fs.copyFile(fileSorceName, fileDestinationName, (err) => {
      if (err) throw err;
    });    
  }
})
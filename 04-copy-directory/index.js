const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const filesFolderName = path.join(__dirname, 'files');
const filesCopyFolderName = path.join(__dirname, 'files-copy');

async function copyFolder(originalFolder, destinationFolder) {

  await fsPromises.mkdir(destinationFolder, { recursive: true });

  await fs.readdir(destinationFolder, { recursive: true }, (err, files) => {
    if (err) throw err;
  
    for (let file of files) {
      fs.unlink(path.join(destinationFolder, file), err => {
        if (err) throw err;         
      });      
    }
    console.log('Any existing files were successfully deleted.');
  });

  let items = await fsPromises.readdir(originalFolder, { withFileTypes: true });

  for (let item of items) {
    let originalPath = path.join(originalFolder, item.name);
    let destinationPath = path.join(destinationFolder, item.name);

    item.isDirectory() ?
        await copyFolder(originalPath, destinationPath) :
        await fsPromises.copyFile(originalPath, destinationPath);
  }
  console.log(`Files have been successfully copied to ${destinationFolder}`); 
}
copyFolder(filesFolderName, filesCopyFolderName);
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const filesFolderName = path.join(__dirname, 'files');
const filesCopyFolderName = path.join(__dirname, 'files-copy');

async function copyFolder(originalFolder, destinationFolder) {

  await fsPromises.mkdir(destinationFolder, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('The destination folder is created or already exists');
  });

  await fs.readdir(destinationFolder, (err, files) => {
    if (err) throw err;
  
    for (let file of files) {
      fs.unlink(path.join(destinationFolder, file), err => {
        if (err) throw err;         
      });      
    }
    console.log('The existing files were successfully deleted.');
  });

  await fs.readdir(originalFolder, (err, files) => {
    if (err) throw err;
      
    for (let file of files) {
      let fileOriginalName = path.join(originalFolder, file);
      let fileDestinationName = path.join(destinationFolder, file);

      fs.copyFile(fileOriginalName, fileDestinationName, (err) => {
        if (err) throw err;
      }); 
    }
    console.log(`Files have been successfully copied to ${destinationFolder}`); 
  })
}
copyFolder(filesFolderName, filesCopyFolderName);
async function copyDirectory() {
  const path = require('path');
  const fs = require('fs');

  const resolvedPath = path.resolve(__dirname);
  const filesCopyFolderName = path.join(resolvedPath, 'files-copy');
  const filesFolderName = path.join(resolvedPath, 'files');
  
  // check if the folder exists, if not - create the folder
  await fs.access(filesCopyFolderName, (error) => {
    if (error) {
      console.log("Directory does not exist.");
      fs.mkdir(filesCopyFolderName, { recursive: true }, (err) => {
        if (err) throw err;
      });
    } else {
      console.log("Directory exists.");
    }
  })

  await fs.readdir(filesFolderName, (err, files) => {
    if (err) throw err;
      
    for (let file of files) {
      let fileSorceName = path.join(resolvedPath, 'files', file);
      let fileDestinationName = path.join(filesCopyFolderName, file);

      fs.copyFile(fileSorceName, fileDestinationName, (err) => {
        if (err) throw err;
      }); 
    }
    console.log('Files have been successfully copied to files-copy'); 
  })
}

copyDirectory();
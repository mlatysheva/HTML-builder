async function filesInfo() {
  const path = require('path');
  const fs = require('fs');

  const resolvedPath = path.resolve(__dirname, 'secret-folder');
  
  await fs.readdir(resolvedPath, (err, files) => {
    if (err) throw err;
      
    for (let file of files) {
      let fileName = path.join(resolvedPath, file);

      fs.stat(fileName, (err, stats) => {
        if (err) {
          console.error(err)
          return;
        }
        if (stats.isFile()) {
          console.log(path.basename(file, path.extname(fileName)) + ' - ' 
            + path.extname(fileName).substring(1) + ' - ' + Math.floor(stats.size/1024) + 'kb');
        }
      })
    }
  })
}

filesInfo();
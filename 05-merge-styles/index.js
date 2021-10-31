async function mergeStyles() {

  const fs = require('fs');
  const path = require('path');

  const pathToStyles = path.resolve(__dirname, 'styles');
  const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

  const writeStream = fs.createWriteStream(pathToBundle);

  await fs.readdir(pathToStyles, (err, files) => {
    if (err) throw err;
       
    for (let file of files) {
      
      let fileName = path.join(pathToStyles, file);

      fs.stat(fileName, (err, stats) => {
        let stylesArray = new Array();
        if (err) {
          console.error(err)
          return;
        }
        if (stats.isFile() && path.extname(fileName) == '.css') {
          const instream = fs.createReadStream(fileName, "utf-8");
          instream.on("data", (chunk) => { 
            stylesArray.push(chunk);
            stylesArray.forEach(value => writeStream.write(`${value}\n`, (err) => {
              writeStream.end();
            }));                 
          });
        }
      })
    }
    console.log(`Bundle.css is successfully compiled in: ${pathToBundle}`);
  })
}
mergeStyles();

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectDistPath = path.join(__dirname, 'project-dist');
const pathToTemplate = path.join(__dirname, 'template.html');
const newIndexPath = path.join(projectDistPath, 'index.html');

// create the folder 'project-dist'
fs.access(projectDistPath, (error) => {
  if (error) {
    console.log("Directory does not exist.");
    fs.mkdir(projectDistPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
  } else {
    console.log("Directory exists.");
  }

  // create index.hmtl in project-dist and copy there template.html with all components
  let writeableStream = fs.createWriteStream(newIndexPath);

  const rl = readline.createInterface({
    input: fs.createReadStream(pathToTemplate)
  });

  rl.on('line', (line) => {
    if (line.includes('{{')) {
      let regEx = /\{\{[a-zA-Z ]+\}\}/;
      let componentName = String(line.match(regEx));
      let fileName = componentName.substring(2, componentName.length-2).replace(/\s/g, '') + '.html';
      console.log('fileName is: ' + fileName);
      const instream = fs.createReadStream(path.join(__dirname, 'components', fileName), "utf-8");
      instream.on("data", (chunk) => { 
        writeableStream.write(`\n${chunk}`, (err) => {
          writeableStream.end();
        })
      })      
    }
    else {
      writeableStream.write(line + '\n');
    }
  });
  // merge all styles into project-dist/style.css

  const pathToStyles = path.resolve(__dirname, 'styles');
  const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');

  const writeStream = fs.createWriteStream(pathToBundle);
  console.log(pathToBundle);

  fs.readdir(pathToStyles, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      let fileName = path.join(pathToStyles, file);

      fs.stat(fileName, (err, stats) => {
        if (err) {
          console.error(err)
          return;
        }
        if (stats.isFile() && path.extname(fileName) == '.css') {
          const instream = fs.createReadStream(fileName, "utf-8");
          instream.on("data", (chunk) => { 
            writeStream.write(`${chunk}\n`, (err) => {
              // if (err) throw err;
              writeStream.end();
            })
          })   
        }
      })
    }
    console.log(`Bundle.css is successfully compiled in: ${pathToBundle}`);
  })
})



// // copy the /assets folder to /project-dist
// const originalAssetsFolder = path.join(__dirname, 'assets');
// const distAssetsFolder = path.join(__dirname, 'project-dist', 'assets');
// fs.access(distAssetsFolder, (error) => {
//   if (error) {
//     console.log("Directory does not exist.");
//     fs.mkdir(distAssetsFolder, { recursive: true }, (err) => {
//       if (err) throw err;
//     });
//   } else {
//     console.log("Directory exists.");
//   }
//   fs.readdir(originalAssetsFolder, (err, files) => {
//     if (err) throw err;
      
//     for (let file of files) {
//       let originalFile = path.join(originalAssetsFolder, file);
//       let distFile = path.join(distAssetsFolder, file);
  
//       fs.copyFile(originalFile, distFile, (err) => {
//         if (err) throw err;
//       });    
//     }
//   })
// })
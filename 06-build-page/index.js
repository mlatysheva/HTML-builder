const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fsPromises = require('fs/promises');

const projectDistPath = path.join(__dirname, 'project-dist');
const pathToTemplate = path.join(__dirname, 'template.html');
const newIndexPath = path.join(projectDistPath, 'index.html');

async function createFolder(folder) {
  // create the folder 'project-dist'
  await fs.access(folder, (error) => {
    if (error) {
      fs.mkdir(folder, (err) => {
        if (err) {
          throw err
        } else {
          console.log('The folder was successfully created');
        }
      });
    } else {
      console.log('The folder already exists.');
    }
  })
}

async function mergeStyles(originalFolder, destinationFile) {
  
  const writeStream = fs.createWriteStream(destinationFile);

  await fs.readdir(originalFolder, (err, files) => {
    if (err) throw err;
       
    for (let file of files) {      
      let fileName = path.join(originalFolder, file);
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
    console.log(`The css file was successfully compiled in: ${destinationFile}`);
  })
}

async function copyDirectory(originalFolder, destinationFolder) {
    
  // check if the folder exists, if not - create the folder
  await fs.access(destinationFolder, (error) => {
    if (error) {
      console.log("Directory does not exist.");
      fs.mkdir(destinationFolder, { recursive: true }, (err) => {
        if (err) throw err;
      });
    } else {
      console.log("Directory exists.");
    }
  })

  await fs.readdir(originalFolder, (err, files) => {
    if (err) throw err;
      
    for (let file of files) {
      let fileSorceName = path.join(originalFolder, file);
      let fileDestinationName = path.join(destinationFolder, file);

      fs.copyFile(fileSorceName, fileDestinationName, (err) => {
        if (err) {
          console.log(err)
          throw err;
        }
      }); 
    }
    console.log(`Files have been successfully copied to ${destinationFolder}`); 
  })
}

async function copyDir(originalFolder, destinationFolder) {
  try {
    fsPromises.mkdir(destinationFolder, {recursive: true});
    const files = await fsPromises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = path.join(originalFolder, file.name);
        const copyPath = path.join(destinationFolder, file.name);
        fsPromises.copyFile(filePath, copyPath);
      }
    }
  } catch(err) {
    console.error(err);
  }
  console.log(`Files have been successfully copied to ${destinationFolder}`); 
}

async function createProjectBundle(distFolder, templateFile, distIndexFile) {
  
  await createFolder(distFolder);

  const pathToStyles = path.join(__dirname, 'styles');
  const pathToBundle = path.join(distFolder, 'styles.css');
  await mergeStyles(pathToStyles, pathToBundle);

  const resolvedPath = path.resolve(__dirname);
  const originalAssetsFolder = path.join(resolvedPath, 'assets');
  const destinationAssetsFolder = path.join(distFolder, 'assets');

  copyDir(originalAssetsFolder, destinationAssetsFolder);

  // await copyDirectory(resolvedPath, originalAssetsFolder, destinationAssetsFolder);
}

createProjectBundle(projectDistPath, pathToTemplate, newIndexPath);


  // create index.hmtl in project-dist and copy there template.html with all components
  // let writeableStream = fs.createWriteStream(newIndexPath);

  // const rl = readline.createInterface({
  //   input: fs.createReadStream(pathToTemplate)
  // });

  // rl.on('line', (line) => {
  //   if (line.includes('{{')) {
  //     let regEx = /\{\{[a-zA-Z ]+\}\}/;
  //     let componentName = String(line.match(regEx));
  //     let fileName = componentName.substring(2, componentName.length-2).replace(/\s/g, '') + '.html';
  //     console.log('fileName is: ' + fileName);
  //     const instream = fs.createReadStream(path.join(__dirname, 'components', fileName), "utf-8");
  //     instream.on("data", (chunk) => { 
  //       writeableStream.write(`\n${chunk}`, (err) => {
  //         writeableStream.end();
  //       })
  //     })      
  //   }
  //   else {
  //     writeableStream.write(line + '\n');
  //   }
  // });



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
//         console.log('File is copied.');
//       });    
//     }
//   })
// })
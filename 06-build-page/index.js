const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fsPromises = require('fs/promises');

const projectDistPath = path.join(__dirname, 'project-dist');
const pathToTemplate = path.join(__dirname, 'template.html');
const newIndexPath = path.join(projectDistPath, 'index.html');

async function createFolder(folder) {

  await fsPromises.rm(folder, {force:true, recursive:true});
  
  await fsPromises.mkdir(folder, { recursive: true }, (err) => {
    if (err) throw err;
  });
  console.log('The destination folder is created or already exists');
  await fsPromises.readdir(folder, (err, files) => {
    if (err) throw err;
  
    for (let file of files) {
      fs.unlink(path.join(folder, file), (err) => {
        if (err) throw err;  
        console.log('The existing files were successfully deleted.');        
      });     
    }     
  });
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
              // writeStream.end();
            }));                 
          });
        }
      })
    }
    console.log(`The css file was successfully compiled in: ${destinationFile}`);
  })
}

async function copyFolder(originalFolder, destinationFolder) {

  await fsPromises.mkdir(destinationFolder, { recursive: true });

  let items = await fsPromises.readdir(originalFolder, { withFileTypes: true });

  for (let item of items) {
    let originalPath = path.join(originalFolder, item.name);
    let destinationPath = path.join(destinationFolder, item.name);

    item.isDirectory() ?
        await copyFolder(originalPath, destinationPath) :
        await fsPromises.copyFile(originalPath, destinationPath);
  }
}

// create index.hmtl in project-dist and copy there template.html with all components

async function indexFile(template, newIndex) {

  await fs.readFile(template, "UTF8", function(err, data) {
    var template_data;
    if (err) { throw err }
    template_data = data;

    let regEx = /\{\{(.*?)\}\}/g;
    const placeholders = template_data.match(regEx);
    placeholders.forEach(placeholder => {
      let fileName = placeholder.substring(2, placeholder.length-2).replace(/\s/g, '') + '.html';
      const instream = fs.createReadStream(path.join(__dirname, 'components', fileName), "utf-8");
      instream.on("data", (chunk) => { 
        let writeableStream = fs.createWriteStream(newIndex);
        template_data = template_data.replace(placeholder, chunk);
        writeableStream.write(template_data); 
        writeableStream.end();  
      })      
    }); 
  console.log('Index.html is successfully generated in project-dist');
  })  
}
  
// main function
async function createProjectBundle(distFolder, templateFile, distIndexFile) {
  
  await createFolder(distFolder);

  const pathToStyles = path.join(__dirname, 'styles');
  const pathToBundle = path.join(distFolder, 'style.css');
  await mergeStyles(pathToStyles, pathToBundle);

  await indexFile(templateFile, distIndexFile);

  const originalAssetsFolder = path.join(__dirname, 'assets');
  const destinationAssetsFolder = path.join(distFolder, 'assets');

  await copyFolder(originalAssetsFolder, destinationAssetsFolder);
}

createProjectBundle(projectDistPath, pathToTemplate, newIndexPath);
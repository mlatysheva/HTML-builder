const fs = require('fs');
const path = require('path');

const resolvedPath = path.resolve('01-read-file', 'text.txt');

const instream = fs.createReadStream(resolvedPath, "utf-8");
instream.on("data", (chunk) => { 
  console.log(chunk);
});


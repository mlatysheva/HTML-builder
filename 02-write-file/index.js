const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const resolvedPath = path.resolve('02-write-file', 'input.txt');

let writeableStream = fs.createWriteStream(resolvedPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
 
function waitForUserInput() {
  rl.question('Please input your text. To finish the input, press "Ctrl+c" or type "exit": ', function(answer) {
    if (answer.includes('exit')) {

      //write to a file minus last 4 characters;
      writeableStream.write('\n' + answer.substring(0, answer.length - 4));      
      rl.close();
    } else {
      writeableStream.write('\n' + answer);
      waitForUserInput();
    }
    rl.on('close', function() {
      console.log('\nGood-bye!');
      process.exit(0);
    });
  });
}
waitForUserInput();


const stdout = process.stdout;
const stdin = process.stdin;
const flag = process.argv[2];

stdout.write('Enter two numbers: \n');
stdin.on('data', (data) => {
  const arr = data.toString().split(' ');
  const sum = arr.reduce((a,b) => +a + +b);
  const multiple = arr.reduce((a, b) => +a * +b);
  if(arr.length === 2 && flag === '-s') {
    stdout.write(`${+arr[0]} + ${+arr[1]} = ${sum}`);
  } else if (arr.length === 2 && flag === '-m') {
    stdout.write(`${+arr[0]} * ${arr[1]} = ${multiple}`);
  } else {
    stdout.write('Try again to run the file with the flag of -s or -m');
  }
  process.exit();
});
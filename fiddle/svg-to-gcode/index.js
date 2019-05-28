const svgcode = require('svgcode');
const path = require('path');
const fs = require('fs');
const meow = require('meow');

const cli = meow(`
  Usage: node index.js relative/path/to/file.svg

  Will output next to the srcfile with .gz extension.
`, {});

if (cli.input.length === 0) {
  cli.showHelp();
}
const opts = {
  depth: 9,
  unit: 'mm',
  map: 'xyz',
  top: -10
};

const inFile = path.resolve(process.cwd(), cli.input[0]);
const outFile = `${inFile.replace('.svg', '.gc')}`;
console.log(outFile);
const gcode = svgcode()
  .loadFile(inFile)
  // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

gcode.splice(3,0,'G0 Z10'); // insert a lift at start after the first three elements
gcode.push('G0 Z10'); // left the pen at the end
gcode.push('G0 X0 Y0'); // Go Home again
gcode.forEach((ele, i, arr) => {
  arr[i] = ele.replace('Z0','Z1');
});
console.log(gcode);
fs.writeFile(outFile, gcode.join('\n'), 'utf8', (err) => {
  if (err) {
    throw err;
  }
  // console.log(data);

});

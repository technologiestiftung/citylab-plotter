const {svgcode} = require('../../dist');

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
  // depth: 9,
  // unit: 'mm',
  // map: 'xyz',
  // top: -10
};

const inFile = path.resolve(process.cwd(), cli.input[0]);
const outFile = `${inFile.replace('.svg', '.gc')}`;
console.log(outFile);
const svg = fs.readFileSync(inFile, 'utf8');
const gcode = svgcode()
  // .loadFile(inFile)
  .setSvg(svg)
  // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

console.log(gcode);
fs.writeFile(outFile, gcode.join('\n'), 'utf8', (err) => {
  if (err) {
    throw err;
  }
  // console.log(data);

});

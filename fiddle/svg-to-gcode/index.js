const svgcode = require('svgcode');
const path = require('path');
const fs = require('fs');

const opts = {
  depth: 9,
  unit: 'mm',
  map:'xyz',
  top: -10
};

const inFile = path.resolve(__dirname, './in-svg/A4-rect-1010_200200.svg');
const outFile = `${inFile.replace('.svg','.gc')}`;
console.log(outFile);
const gcode = svgcode()
  .loadFile(inFile)
  // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

gcode.unshift('G0 Z10'); // lift at start
gcode.push('G0 Z10'); // left the pen at the end
gcode.push('G0 X0 Y0'); // Go Home again
console.log(gcode);
fs.writeFile(outFile, gcode.join('\n'), 'utf8', (err,data)=>{
  if (err){
    throw err;
  }
  console.log(data);

});

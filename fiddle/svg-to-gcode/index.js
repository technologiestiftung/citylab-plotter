const svgcode = require('svgcode');
const path = require('path');
const fs = require('fs');

const opts = {
  depth: 10,
  unit: 'mm',
  map:'xyz',
  top: -10
};

const gcode = svgcode()
  // .loadFile(path.resolve(__dirname, './in-svg/A4-rect-1010_200200.svg'))
  .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

gcode.unshift('G0 Z10'); // lift at start
gcode.push('G0 Z10'); // left the pen at the end
gcode.push('G0 X0 Y0'); // Go Home again
console.log(gcode);
fs.writeFile(path.resolve(__dirname, './out-gcode/town-A0.gc'), gcode.join('\n'), 'utf8', (err,data)=>{
  if (err){
    throw err;
  }
  console.log(data);

});

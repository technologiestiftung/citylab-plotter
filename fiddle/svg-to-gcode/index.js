const svgcode = require('svgcode');
const path = require('path');
const fs = require('fs');

const opts = {
  depth: -10
};

const gcode = svgcode()
  .loadFile(path.resolve(__dirname, './in-svg/A4.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

console.log(gcode);
fs.writeFile(path.resolve(__dirname, './out-gcode/A4.gcode'), gcode.join('\n'), 'utf8', (err,data)=>{
  if (err){
    throw err;
  }
  console.log(data);

});

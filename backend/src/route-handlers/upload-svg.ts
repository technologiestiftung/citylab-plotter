import { svgcode } from '@tsb/svgcode';
import fs from 'fs';
import util from 'util';

import { AsyncRoute } from '../common/types';
import { responsePayload } from './response-payload';
const readFileAsync = util.promisify(fs.readFile);
export const uploadSVG: AsyncRoute = async (request, response) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log('file', request.file);
  const opts = {
    // depth: 9,
    // unit: 'mm',
    // map: 'xyz',
    // top: -10
  };
  const fileContent = await readFileAsync(request.file.path, 'utf8');
  const gcode = svgcode()
    // .loadFile(inFile)
    .setSvg(fileContent)
    .setOptions(opts)
    .generateGcode()
    .getGcode();
  response.json(await responsePayload(JSON.stringify({ gcode }), true));
};

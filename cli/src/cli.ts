#!/usr/bin/env node
import { svgcode } from '@tsb/svgcode';
// import { svgcode } from '../../svgcode/dist/index';

import chalk from 'chalk';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
// import superagent = require('superagent');
import util from 'util';
// import { config } from 'dotenv';
import { IObject } from './interfaces';

const readFileAsync = util.promisify(fs.readFile);

// let host: string = process.env.EXPRESS_HOST || 'http://localhost:3000';

const main = async () => {

  const cli = meow(`
  Usage: svgcode ./path/to/infile.svg [./path/to/outfile.gc] [FLAGS]

  Options:
    -c --config {string} Path to config.json
    -d --dedupe {boolean} Default true removes following duplicate lines from gcode
    -f --feedrate {number} Default 3125 Feedrate to write to top of gcode
    --floor {boolean} Default true Removes .000 values from coordinates
    --print {boolean} Default false Prints the Gcode after generation

  Config (needs valid json overrules cli flags):
  {
    "depth": 10,
    "map": "xyz",
    "precision": 1,
    "ramping": false,
    "toolDiameter": 1,
    "top": -10,
    "unit": "mm",
    "floor": false,
    "dedupe": true,
    "feedrate": 3000,
    "print": false
  }


  `, {
      flags: {
        // close: {
        //   alias: 'x',
        //   type: 'boolean',
        // },
        // convert: {
        //   alias: 'c',
        //   type: 'string',
        // },
        config: {
          alias: 'c',
          type: 'string',
        },
          dedupe: {
            alias: 'd',
            default: true,
            type: 'boolean',
          },
        feedrate: {
          alias: 'f',
          default: 3125,
          type: 'string',
        },
        floor: {
          default: true,
          type: 'boolean',
        },
        print: {
          type: 'boolean',
        },
      },
    });

  // console.log(cli.input, cli.flags);

  let opts: IObject = {};
  if (cli.flags.config !== undefined) {
    const configFile = path.resolve(process.cwd(), cli.flags.config);
    let configFileExists = false;
    try {
      if (fs.statSync(configFile)) {
        configFileExists = true;
      }
    } catch (error) {
      console.log(chalk.red(`The config file "${configFile}" does not exist`));
      process.exit(1);
    }
    let json: IObject | undefined;
    if (configFileExists === true) {
      try {
        json = JSON.parse(await readFileAsync(configFile, 'utf8'));
      } catch (error) {
        console.log(chalk.red(`The config file "${configFile}" is not valid JSON`));
        process.exit(1);
      }
    }
    opts = Object.assign({}, json);
  }
  const doFloor = opts.floor !== undefined ? opts.floor : cli.flags.floor;
  const doDedupe = opts.dedupe !== undefined ? opts.dedupe : cli.flags.dedupe;
  const doPrint = opts.print !== undefined ? opts.print : cli.flags.print;
  const feedrate = opts.feedrate !== undefined ? opts.feedrate : cli.flags.feedrate;
  // console.log(opts);
  delete opts.floor;
  delete opts.dedupe;
  delete opts.print;
  delete opts.feedrate;

  if (cli.input[0] !== undefined) {
    try {
      const inFile = path.resolve(process.cwd(), cli.input[0]);
      if (fs.statSync(inFile)) {
        let outFile: string | undefined;
        if (cli.input[1] === undefined) {
          outFile = `${inFile.replace('.svg', '.gc')}`;
        } else {
          outFile = path.resolve(process.cwd(), cli.input[1]);
        }
        const svg = fs.readFileSync(inFile, 'utf8');
        const gcode = svgcode(doFloor, doDedupe, feedrate, opts)
          .setSvg(svg)
          .setOptions(opts)
          .generateGcode()
          .getGcode();
        const data = gcode.join('\n');
        fs.writeFile(outFile, data, 'utf8', (err) => {
          if (err) {
            throw err;
          } else {
            console.log(`Wrote GCode to :${outFile}`);
          }
        });
        // superagent.post(`${host}`).send({ commands: gcode }).then(console.log).catch(console.error);
        if (doPrint === true) {
          console.log(gcode.join('\n'));
        }
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  } else {
    // cli.showHelp();
  }

};
main().catch(console.error);

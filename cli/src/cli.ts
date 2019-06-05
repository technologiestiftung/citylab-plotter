import { svgcode } from '@tsb/svgcode';

import fs from 'fs';
import meow from 'meow';
import path from 'path';
import superagent = require('superagent');
import util from 'util';

const readFileAsync = util.promisify(fs.readFile);

let host: string = process.env.EXPRESS_HOST || 'http://localhost:3000';

const main = async () => {

  const cli = meow(`
  Usage: node cli.js [FLAGS]

  Options:

    -o --open {boolean}
    -d --close {boolean}
    -g --gcode {string} Path to gcode file
    -u --unlock {boolean} Send unlock command $X
    -p --portpath {string} Path to serial port
    -z --zeroall {boolean} Send zero all command. Usefull after home
    -c --convert {string} Path to SVG file. Will convert to GCODE
         and write to the same location
    --outfile {string} Path to output file for --convert
    --home {boolean} send homeing command $H
    --host {string} Host domain default is ${host}
         (can be set via env varialbe EXPRESS_HOST)
    --state {boolean} Get app state
         (there you will find the port path)

  Example:
    Send some gcode
    $ node cli.js --open --portpath /dev/tty.usbmodem143201 -g ../realtive/path/to/file.gcode

    Open the port and do a homeing command
    node cli.js -oh
  `, {
      flags: {
        close: {
          alias: 'x',
          type: 'boolean',
        },
        convert: {
          alias: 'c',
          type: 'string',
        },
        gcode: {
          alias: 'g',
          type: 'string',
        },
        home: {
          type: 'boolean',
        },
        host: {
          type: 'string',
        },
        open: {
          alias: 'o',
          type: 'boolean',
        },
        outfile: {
          type: 'string',
        },
        portpath: {
          alias: 'p',
          type: 'string',
        },
        state: {
          type: 'boolean',
        },
        unlock: {
          alias: 'u',
          type: 'boolean',
        },
        zeroall: {
          alias: 'z',
          type: 'boolean',
        },
      },
    });

  // console.log(cli.input, cli.flags);

  // if (cli.input.length === 0) {
  //   cli.showHelp();
  // }
  const opts = {
    // depth: 9,
    // unit: 'mm',
    // map: 'xyz',
    // top: -10,
    toolDiamter: 1,
  };
  // const keys = Object.keys(cli.flags);

  if (cli.flags.state === true) {
    try {
      const state = await superagent.get(`${host}`);
      console.log(state.text);
      process.exit(0);
    } catch (error) {
      console.error(error);
    }
  }
  if (cli.flags.open === true) {
    let portPath: string | undefined;
    if (cli.flags.portpath !== undefined) {
      portPath = cli.flags.portpath;
    }
    try {
      const res = await superagent.post(`${host}/commands/connect`).send({ portPath });
      console.log(res.body);
    } catch (error) {
      console.error(error);
    }
  }

  if (cli.flags.close === true) {
    try {
      const res = await superagent.post(`${host}/commands/disconnect`).send({});
      console.log(res.body);
    } catch (error) {
      console.error(error);
    }

  }
  if (cli.flags.home === true) {
    try {
      const res = await superagent.post(`${host}/commands/home`).send({});
      console.log(res.body);
    } catch (error) {
      console.error(error);
    }
  }
  if (cli.flags.zeroall === true) {
    try {
      const res = await superagent.post(`${host}/commands/zeroall`).send({});
      console.log(res.body);
    } catch (error) {
      console.error(error);
    }
  }
  if (cli.flags.unlock === true) {
    try {
      const res = await superagent.post(`${host}/commands/unlock`).send({});
      console.log(res.body);
    } catch (error) {
      console.error(error);
    }

  }
  if (cli.flags.host !== undefined) {
    host = cli.flags.host;
  }

  if (cli.flags.gcode !== undefined) {
    try {
      // console.log(cli.flags.g);
      const inFile = path.resolve(process.cwd(), cli.flags.g);
      if (fs.statSync(inFile)) {
        console.log('input file:', inFile);
      }
      const gcodeRaw = await readFileAsync(inFile, 'utf8');
      const gcode = gcodeRaw.split('\n');
      gcode.map(ele => ele += `${ele}\n`);
      gcode.forEach((ele, i, arr) => {
        if (ele.endsWith('\n') === false) {
          arr[i] = `${ele}\n`;
        }
      });
      for (let i = 0; i < gcode.length; i++) {
        if (gcode[i].match(/\(.*?\)/) !== null) {
          gcode.splice(i, 1);
          i--;
        }
      }
      console.log(gcode);
      const res = await superagent.post(`${host}`).send({ commands: gcode });
      console.log(res.text);

    } catch (error) {
      console.error('GCode file does not exist');
      process.exit(1);
    }
  }
  if (cli.flags.convert !== undefined) {
    try {
      const inFile = path.resolve(process.cwd(), cli.flags.convert);
      if (fs.statSync(inFile)) {
        let outFile: string | undefined;
        if (cli.flags.outfile === undefined) {
          outFile = `${inFile.replace('.svg', '.gc')}`;
        } else {
          outFile = path.resolve(process.cwd(), cli.flags.outfile);
        }
        // console.log(outFile);
        const svg = fs.readFileSync(inFile, 'utf8');
        const gcode = svgcode()
          // .loadFile(inFile)
          .setSvg(svg)
          // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
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
        process.stdout.write(gcode.join('\n'));
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  // fs.writeFile(outFile, gcode.join('\n'), 'utf8', (err) => {
  //   if (err) {
  //     throw err;
  //   }
  // });

};
main().catch(console.error);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_gameloop_1 = __importDefault(require("node-gameloop"));
const path_1 = __importDefault(require("path"));
const Crack_1 = require("./Crack");
const Store_1 = require("./Store");
const store = Store_1.Store.getInstance();
const canvas_1 = require("canvas");
const meow_1 = __importDefault(require("meow"));
const ora_1 = __importDefault(require("ora"));
const spinner = ora_1.default('substrate(ing)');
spinner.start();
const cli = meow_1.default(`
  Usage:
    node dist/index.js input [flags]
    node dist/index.js path/to/outfile.svg --duration 60
    node dist/index.js path/to/outfile.svg --duration 60 --width 841 --height 1149
    node dist/index.js path/to/outfile.svg --duration 60 --width 841 --height 1149 --maxcracks 200
  Flags:
    --duration -d {string} Duration tu run the substrate in seconds. Default: 60
    --height -h {string} Height of the output svg. Default: 1189 (A0 if 1px === 1mm)
    --width -w {string} Width of the output svg. Default: 841 (A0 if 1px === 1mm)
    --maxcracks -m {string} Maximum number of cracks computed in parallel. Default: 200
    `, {
    flags: {
        duration: {
            alias: 'd',
            default: 60,
            type: 'string',
        },
        height: {
            alias: 'h',
            default: 1189,
            type: 'string',
        },
        maxcracks: {
            alias: 'm',
            default: 200,
            type: 'string',
        },
        width: {
            alias: 'w',
            default: 841,
            type: 'string',
        },
    },
});
// tslint:disable-next-line: max-line-length
const duration = typeof cli.flags.duration === 'string' ? parseFloat(cli.flags.duration) * 1000 : cli.flags.duration * 1000;
const width = typeof cli.flags.width === 'string' ? parseInt(cli.flags.width, 10) : cli.flags.width;
const height = typeof cli.flags.height === 'string' ? parseInt(cli.flags.height, 10) : cli.flags.height;
const maxcracks = typeof cli.flags.maxcracks === 'string' ? parseInt(cli.flags.maxcracks, 10) : cli.flags.maxcracks;
const canvas = canvas_1.createCanvas(width, height, 'svg');
const ctx = canvas.getContext('2d');
const maxnum = maxcracks;
let crackCounter = 0;
let outFilePath = path_1.default.resolve(process.cwd(), `./substrate-${Date.now()}.svg`);
// const cracks: Crack[] = [];
const dimx = width;
const dimy = height;
// const cgrid: number[] = [];
if (cli.input[0] === undefined) {
    console.info(`No path for the output given. I will use ${outFilePath}`);
    // cli.showHelp();
}
else {
    try {
        if (fs_1.default.existsSync(path_1.default.dirname(cli.input[0])) === true) {
            outFilePath = path_1.default.resolve(process.cwd(), cli.input[0]);
        }
    }
    catch (error) {
        // tslint:disable-next-line: no-console
        // console.error(error);
        // tslint:disable-next-line: no-console
        console.error(`Outputpath can not be set. I will use ${outFilePath}`);
    }
}
exports.makeCrack = () => {
    // console.log(store.cgrid);
    if (crackCounter < maxnum) {
        // make a new crack instance
        const c = new Crack_1.Crack(dimx, dimy);
        // console.log(c);
        store.addCrack(c);
        crackCounter++;
    }
    // console.log(store.cracks);
};
const begin = () => {
    // erase crack grid
    for (let y = 0; y < dimy; y++) {
        for (let x = 0; x < dimx; x++) {
            store.setCgridVal(y * dimx + x, 10001);
        }
    }
    // console.log(store.cgrid);
    // make random crack seeds
    // only places values in the cgrid
    // does not create something
    // is only there to have some values in the list
    for (let k = 0; k < 16; k++) {
        // select random from the grid
        const i = Math.floor(Math.random() * (dimx * dimy - 1));
        store.setCgridVal(i, Math.floor(Math.random() * 360));
    }
    // make just three cracks
    crackCounter = 0;
    for (let k = 0; k < 10; k++) {
        exports.makeCrack();
    }
};
begin();
// start the loop at 30 fps (1000/30ms per frame) and grab its id
let frameCount = 0;
const frameRate = 60;
const id = node_gameloop_1.default.setGameLoop((delta) => {
    // `delta` is the delta time from the last frame
    frameCount++;
    spinner.text = `
   _    |_  _ _|_ __ _ _|_ _
  _> |_||_)_>  |_ | (_| |_(/_
  based on http://www.complexification.net/gallery/machines/substrate/
  by Jared S Tarbell @jaredtarbell

  substrate(ing) @ framerate ${frameRate} frame=${frameCount}
  width    ${width}
  height   ${height}
  duration ${duration}s
  maxnum   ${maxcracks}
  output 2 ${outFilePath}
  `;
    for (let n = 0; n < crackCounter; n++) {
        store.cracks[n].move();
    }
    // console.log(cracks);
}, 1000 / frameRate);
// stop the loop 2 seconds later
setTimeout(() => {
    // tslint:disable-next-line: no-console
    spinner.text = `${duration / 1000}s passed, stopping substrate`;
    node_gameloop_1.default.clearGameLoop(id);
    // console.log('traces', store.traces);
    for (const t of store.traces) {
        ctx.beginPath();
        ctx.moveTo(t.start.x, t.start.y);
        ctx.lineTo(t.end.x, t.end.y);
        ctx.stroke();
    }
    fs_1.default.writeFileSync(outFilePath, canvas.toBuffer());
    spinner.stop();
    spinner.succeed(spinner.text);
}, duration);
//# sourceMappingURL=index.js.map
import canvg from 'canvg';
// import fs, { PathLike } from 'fs';
import Gcanvas from 'gcanvas';
import { Stream } from 'stream';
import {  GCodeCommands, IDefaultOptions, IObject, ISvgcode } from './common';

// totally ripped from
// https://github.com/piLeoni/svgcode

// interface IGcanvas extends HTMLCanvasElement {
//   [key: string]: any;
//   depth?: number;
//   precision?: number;
//   ramping?: boolean;
//   toolDiameter?: number;
// }

export const svgcode = () => {
  const output2Array: (target: string[]) => any = (target) => {
    return {
      write(cmd: any) {
        target.push(cmd);
      },
    };
  };

  const defaultOptions: IDefaultOptions = {
    depth: 9,
    map: 'xyz',
    precision: 0.1,
    ramping: false,
    toolDiameter: 1,
    top: -10,
    unit: 'mm',
  };

  const obj: ISvgcode = {
    gCode: [],
    gctx: {},
    svgFile: undefined,
    // loadFile(input: PathLike) {
    //   this.svgFile = fs.readFileSync(input, 'utf8');
    //   return this;
    // },
    setSvg(svg: string) {
      this.svgFile = svg;
      return this;
    },
    setDriver(input: Stream) {
      this.gctx = new Gcanvas(new Gcanvas.GcodeDriver(input));
      return this;
    },
    setOptions(input: IObject) {
      Object.keys(input).forEach(opt => {
        this.gctx[opt] = input[opt];
      });
      return this;
    },
    generateGcode() {
      canvg(this.gctx.canvas, this.svgFile);
      return this;
    },
    printGcode() {
      process.stdout.write(this.gCode.join('\n'));
    },
    getGcode() {
      this.gCode.splice(3, 0, GCodeCommands.lift); // insert a lift at start after the first three elements
      this.gCode.push(GCodeCommands.lift); // left the pen at the end
      this.gCode.push(GCodeCommands.goHome); // Go Home again
      // now we patch some pen down so we don't hit the switch
      this.gCode.forEach((ele, i, arr) => {
        arr[i] = ele.replace('Z0', 'Z1');
      });
      return this.gCode;
    },
  };
  obj.setDriver(output2Array(obj.gCode));
  obj.setOptions(defaultOptions);
  return obj;
};

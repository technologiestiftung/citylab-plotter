import canvg from 'canvg';
// import fs, { PathLike } from 'fs';
import Gcanvas from 'gcanvas';
import { Stream } from 'stream';
import { GCodeCommands, IDefaultOptions, IObject, ISvgcode } from './common';

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
    depth: 10,
    map: 'xyz',
    precision: 1,
    ramping: false,
    toolDiameter: 0,
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
        this.gCode[i] = ele.replace('Z0', 'Z3');
      });
      this.gCode.forEach((ele, i, arr) => {
        arr[i] = ele.replace('G0 Z3', 'G0 Z10');
      });
      this.gCode.forEach((ele, i, arr) => {
        // console.log(ele);
        arr[i] = ele.replace(/([X,Y,Z,x,y,z]\d{1,4})([.]\d{1,6})/g, '$1');
      });
      this.gCode.forEach((ele, i, arr) => {
        arr[i] = ele.replace(/([Y,y]\d{1,4})\ [Z]\d$/g, '$1');
      });

      for (let i = 0; i < this.gCode.length; i++) {
        if (this.gCode[i].match(/\(.*?\)/) !== null) {
          this.gCode.splice(i, 1);
          i--;
        }
      }
      for (let i = 0; i < this.gCode.length; i++) {
        if (i < this.gCode.length - 1) {
          if (this.gCode[i] === this.gCode[i + 1]) {
            this.gCode.splice(i, 1);
            i--;
          }
        }
      }
      return this.gCode;
    },
  };
  obj.setDriver(output2Array(obj.gCode));
  obj.setOptions(defaultOptions);
  return obj;
};

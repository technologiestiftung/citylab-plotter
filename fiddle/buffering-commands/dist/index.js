"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const path_1 = __importDefault(require("path"));
const serialport_1 = __importDefault(require("serialport"));
const CommandBuffer_1 = require("./CommandBuffer");
dotenv_1.config({ path: path_1.default.resolve(__dirname, '../.env') });
const sPort = process.env.SERIAL_PORT || '/dev/tty.usbmodem143101';
const port = new serialport_1.default(sPort, {
    autoOpen: true,
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
});
const commandBuffer = new CommandBuffer_1.CommandBuffer();
commandBuffer.on('command', (cmd) => {
    // console.log(`Hello`);
    // console.log(commandBuffer.commands[0]);
    let currentCommand = '';
    if (cmd === undefined) {
        currentCommand = commandBuffer.commands[0];
    }
    else {
        currentCommand = cmd;
    }
    if (currentCommand === undefined) {
        return;
    }
    if (currentCommand.endsWith('\n') === false) {
        currentCommand = `${currentCommand}\n`;
    }
    port.write(currentCommand, (error, bytes) => {
        if (error) {
            console.error(error);
        }
        else {
            commandBuffer.unshiftCommand();
            console.info(bytes);
        }
    });
});
const parser = port.pipe(new parser_readline_1.default( /*{ delimiter: '\n' }*/));
let gotFinished = false;
let gotStateIdle = false;
parser.on('data', (data) => {
    // console.log(typeof data);
    // console.log('Message from MCU:');
    console.log(data);
    if (data.trim() === ': finished : 0') {
        console.log('Got: finished : 0');
        gotFinished = true;
    }
    if (data.trim() === ': state = Idle') {
        gotStateIdle = true;
        console.log('Got : state = Idle');
    }
    if (gotStateIdle === true && gotFinished === true) {
        console.log('ready for next command');
        gotStateIdle = !gotStateIdle;
        gotFinished = !gotFinished;
        // commandBuffer.emitHello('buddy');
        commandBuffer.emitCommand();
    }
});
port.on('open', () => {
    console.log('port is open');
    // currentState.portIsOpen = true;
    // portIsOpen = true;
});
const app = express_1.default();
const router = express_promise_router_1.default();
/**

 * ## Request With payload
 * curl -X "POST" "http://localhost:3000" \
 *      -H 'Content-Type: application/json; charset=utf-8' \
 *      -d $'{
 *   "commands": [
 *     "foo",
 *     "bah",
 *     "baz"
 *   ]
}'

 */
router.post('/', async (request, response) => {
    try {
        console.log(request.body);
        if (request.body.commands !== undefined) {
            commandBuffer.commands = [...request.body.commands];
        }
        commandBuffer.emitCommand();
        response.json(request.body);
    }
    catch (error) {
        response.status(400).json(request.body);
    }
});
/**
 * ## Request
 * curl -X "POST" "http://localhost:3000/foo"
 */
router.post('/foo', async (request, response) => {
    try {
        console.log(request.body);
        if (request.body.commands !== undefined) {
            commandBuffer.commands = [...request.body.commands];
        }
        commandBuffer.emitCommand('foo');
        response.json(request.body);
    }
    catch (error) {
        response.status(400).json(request.body);
    }
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(router);
app.listen('3000', () => {
    console.log('listening on http://localhost:3000');
});

# CityLAB Plotter

Controlling a plotter [conucon 3DTwin XYZ](https://www.conucon.de/openbuilds/3dtwin-xyz-linearfuehrung-500x500m-mit-usb-cnc-schrittmotor-steuerung-und-software_2000006_1076) with Node over Serialport.  

## Frontend

The frontend is currently a rough Typescript application using redux to handle state. Bundled with parcel. Dev version runs on [http://localhost:1234](http://localhost:1234).


```bash
cd frontend
mv .env.example .env
# adjust API_PORT if needed
npm ci
npm run dev
```

## Backend

A Typescript REST Express API to handle connections over serial port to the plotter MCU.  Dev version runs on [http://localhost:3000](http://localhost:3000).

```bash
cd backend
mv .env.example .env
# adjust SERIAL_PORT if needed
npm ci
npm run dev
```

## Firmware

Currently the firmware is only for dev purpose. Build with platformio on Arduino Mega 2560. It echos what you send over serial.

## License

Copyright (c)  2019 Technologiestiftung Berlin & Fabian Morón Zirfas  
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software  without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to  permit persons to whom the Software is furnished to do so, subject to the following conditions:  
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  

see also http://www.opensource.org/licenses/mit-license.php


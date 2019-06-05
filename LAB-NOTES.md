# Misc Lab Notes

 done during development

## Setup Millimeters for 3DTwin

Machine Work speed = 2500
Positioning speed = 3125
Acceleration = 125
X Axis step per mm 12.5
Y Axis step per mm 12.5
Z Axis step per mm 12.5

Settings via GCodes

```gcode
(work speed)
$4=2500
(position speed)
$5=3125
(Comments = % () ; :)
(Homing speed)
$19=312.5
(Verfahrensgesch. zum ref schalter)
$20=3125
(Acceleration)
$8=125
(refresh interval)
$35=0.1
(x axis steps per mm )
$0=12.5
(y axis steps per mm )
$1=12.5
(z axis steps per mm )
$2=12.5
```

## Orientation Z Axis

`z0` is pen down 
`z10` is lift pen for 10mm


## Simple Annotated GCODE

```gcode
(Lift at start)
G0 Z10
(Set absolute coordiante system)
G90
(set to mm)
G21
(tooldiameter=1)
(draw the rectangle)
G0 X10.5 Y10.5
G0 Z10
(pen down)
G1 Z0
G1 X209.5 Y10.5 Z0
G1 X209.5 Y209.5 Z0
G1 X10.5 Y209.5 Z0
G1 X10.5 Y10.5 Z0
(pen up)
G0 Z10
(go home)
G0 X0 Y0
```

## Din Formats in mm

| DIN A  | in mm         |
| :----- | :------------ |
| **0**  | 841 x 1189 mm |
| **1**  | 594 x 841 mm  |
| **2**  | 420 x 594 mm  |
| **3**  | 297 x 420 mm  |
| **4**  | 210 x 297 mm  |
| **5**  | 148 x 210 mm  |
| **6**  | 105 x 148 mm  |
| **7**  | 74 x 105 mm   |
| **8**  | 52 x 74 mm    |
| **9**  | 37 x 52 mm    |
| **10** | 26 x 37 mm    |


## Messages from MCU

on startup 

```plain
state = Init
conucon controller 1811
state = Alarm
'$H'|'$X' to unlock
```

Set 0 pos at current location:

```plain
g92y0
g92x0
g92z0
```

while in action

```plain
MPos = 10.480,12.720,1.040
WPos = 10.480,12.720,1.040
MPos = 10.480,10.880,1.040
WPos = 10.480,10.880,1.040
finished : 0
state = Idle
bufferr = 4: 0
MPos = 10.480,10.480,1.040
WPos = 10.480,10.480,1.040
```

after homing

```
MPos = 0.960,0.960,0.960
WPos = 0.960,0.960,0.960
finished : 0
state = Idle
bufferr = 4: 0
Position zero
MPos = 1.040,1.040,1.040
WPos = 1.040,1.040,1.040
MPos = 1.040,1.040,1.040
WPos = 1.040,1.040,1.040
```
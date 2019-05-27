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
(Comments = % () ; :)
(Homing speed)
$19=312.5
(Verfahrensgesch. zum ref schalter)
$20=3125
(Acceleration)
$8=125

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

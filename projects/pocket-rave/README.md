# Pocket Rave

An Arduino RGB controller: color cycle, beat pulse and RGB chase. C++ sketch plus a browser simulator. Physical hardware verification is outstanding.

## Parts
Arduino Uno, breadboard, common cathode RGB LED, three 330 ohm resistors, one momentary button, one 10 kΩ potentiometer, jumper wires and USB cable.

## Wiring
Disconnect power while wiring. Check the LED manufacturer's pinout.

| Uno | Connection |
| --- | --- |
| D9 | 330 Ω resistor → red anode |
| D10 | 330 Ω resistor → green anode |
| D11 | 330 Ω resistor → blue anode |
| GND | LED common cathode |
| D2 | Button to GND (`INPUT_PULLUP`) |
| A0 | Potentiometer wiper |
| 5V / GND | Potentiometer outer pins |

Each channel needs its own resistor. The code assumes a common cathode LED. Invert PWM outputs for common anode hardware. Do not attach higher-power LEDs or strips directly to GPIO.

## Upload
Open `pocket_rave/pocket_rave.ino` in Arduino IDE, select Arduino Uno and the connected port, then upload. Press the button to cycle modes. Turn the potentiometer to set 60–180 BPM. Uses built-in Arduino APIs only; no additional library is required.

## Simulation
From the repository root: `python -m http.server 8000`, then visit http://localhost:8000/projects/pocket-rave/. The simulator repeats one LED across three circles for visibility. Browser hue interpolation approximates the physical wheel rather than reproducing PWM electrically. The simulator has a pause button; the physical circuit starts automatically.

## Implementation
30 ms button debounce, unsigned `millis()` elapsed time, 16 ms animation cadence, phase accumulation and PWM color wheel. No blocking `delay()` calls.

Reference: https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay

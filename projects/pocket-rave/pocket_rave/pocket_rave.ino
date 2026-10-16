// Pocket Rave — Arduino Uno, common cathode RGB LED.
// Each color anode requires a separate 330 ohm series resistor.
const byte RED_PIN = 9, GREEN_PIN = 10, BLUE_PIN = 11;
const byte BUTTON_PIN = 2, TEMPO_PIN = A0;
byte mode = 0;
bool lastReading = HIGH, stableButton = HIGH;
unsigned long debounceAt = 0, lastFrame = 0;
float phase = 0.0f;
void writeRGB(byte r, byte g, byte b) {
  analogWrite(RED_PIN, r); analogWrite(GREEN_PIN, g); analogWrite(BLUE_PIN, b);
}
void wheel(byte position, byte brightness) {
  unsigned int r, g, b;
  if (position < 85) { r = 255 - position * 3; g = position * 3; b = 0; }
  else if (position < 170) { position -= 85; r = 0; g = 255 - position * 3; b = position * 3; }
  else { position -= 170; r = position * 3; g = 0; b = 255 - position * 3; }
  writeRGB(r * brightness / 255, g * brightness / 255, b * brightness / 255);
}
void setup() {
  pinMode(RED_PIN, OUTPUT); pinMode(GREEN_PIN, OUTPUT); pinMode(BLUE_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}
void loop() {
  const unsigned long now = millis();
  const bool reading = digitalRead(BUTTON_PIN);
  if (reading != lastReading) debounceAt = now;
  if ((unsigned long)(now - debounceAt) >= 30 && reading != stableButton) {
    stableButton = reading;
    if (stableButton == LOW) mode = (mode + 1) % 3;
  }
  lastReading = reading;
  const unsigned long elapsed = now - lastFrame;
  if (elapsed < 16) return;
  lastFrame = now;
  const int bpm = map(analogRead(TEMPO_PIN), 0, 1023, 60, 180);
  phase += (float)elapsed * bpm / 60000.0f;
  phase -= (unsigned long)phase;
  if (mode == 0) wheel((byte)(phase * 255), 255);
  else if (mode == 1) wheel((byte)(phase * 255), (byte)(20 + 235 * (1.0f - phase)));
  else {
    const byte channel = (byte)(phase * 3);
    writeRGB(channel == 0 ? 255 : 0, channel == 1 ? 255 : 0, channel == 2 ? 255 : 0);
  }
}

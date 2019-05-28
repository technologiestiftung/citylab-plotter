/**
 * Blink
 *
 * Turns on an LED on for one second,
 * then off for one second, repeatedly.
 */
#include "Arduino.h"

#ifndef LED_BUILTIN
#define LED_BUILTIN 13
#endif
char val;
void setup(){
  // initialize LED digital pin as an output.
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("Board is ready");
}

void loop(){

    while (Serial.available() > 0) {

    // look for the next valid integer in the incoming serial stream:
    val = Serial.read();
    Serial.print(val);
    


    // look for the newline. That's the end of your
    // sentence:
  // if (Serial.read() == '\n') {
  //   Serial.print("I'm your Arduino Board and I recieved from P5: ");
  //   Serial.print(val);
  //      } // end of looking for newline char
  }

}
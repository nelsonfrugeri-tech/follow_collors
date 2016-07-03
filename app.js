"use strict";

const TIME   = 500;
const MOVE   = 10;
// Leds pin
const ledWhite  = 2;
const ledRed    = 3;
const ledYellow = 4;
const ledGreen  = 5;
// Buttons pin
const btnWhite  = 8;
const btnRed    = 9;
const btnYellow = 10;
const btnGreen  = 11;

var five     = require('johnny-five');
var board    = new five.Board();
var chosen   = [];
var amount   = 0;
var random   = [];
var array    = null;
var leds     = {};
var btnPress = [];
var counter  = 0;
var buttons  = null;
var piezo    = null;
var notes    = ["C - -", "D - -", "F - -", "G - -"];


// Responsible for create leds, buttons and load function start and eventButtons
board.on("ready", function() {
    // Create leds
    array = new five.Leds([ledGreen, ledYellow, ledRed, ledWhite]);
    leds  = {
        led: array
    };
    // Create buttons
    buttons = new five.Buttons({
        pins: [btnGreen, btnYellow, btnRed, btnWhite],
        isPullup: true
    });
    // Create piezo
    piezo = new five.Piezo(7);

    start();
    eventButtons();
});

/*
    Check if there is move, case yes then initialize variables and generate randowm number
    for next sequence
*/
function start() {
    if(amount < MOVE) {
        // For buttom event
        btnPress    = [];
        counter     = 0;
        // For sequence event
        chosen      = [];
        random.push(gerRandom());
        leds.total = random.length;

        console.log(" *--- Move " + ++amount + "---* \n");
        sequence(0);
    }
    else {
        console.log("*--- Glorious in Victory ---*");
        exit();
    }
}

function gameOver() {
    ledsOff();
    console.log("Game Over");
    exit();
}

function exit() {
    setTimeout(function(){
        process.exit(1);
    }, (TIME * 2));
}

/*
    Through each value of the button pressed and check its corresponding color
*/
function match() {
    // MY DEBUGGER
    myDebugger("btnPress", btnPress);

    for(var i = 0; i < amount; i++) {
        switch (chosen[i]) {
            // White
            case ledWhite:
                if(btnPress[i] !== btnWhite) {
                    gameOver();
                    return false;
                }
                break;
            // Red
            case ledRed:
                if(btnPress[i] !== btnRed) {
                    gameOver();
                    return false;
                }
                break;
            // Yellow
            case ledYellow:
                if(btnPress[i] !== btnYellow) {
                    gameOver();
                    return false;
                }
                break;
            // Green
            case ledGreen:
                if(btnPress[i] !== btnGreen) {
                    gameOver();
                    return false;
                }
                break;
            default:
                console.log("Error in function match");
                break;
        }
    }

    // Next move
    setTimeout(function(){
        start();
    }, TIME);
}

/*
    Wait button press until the entire sequence is complete, to so do match
*/
function eventButtons() {
    buttons.on("press", function(button) {
        pressAndRelease(button, "on");

        if(counter < amount) {
            btnPress.push(button.pin);
            counter++;
        }

        if(counter === amount) {
            match();
        }
    });

    buttons.on("release", function(button) {
        pressAndRelease(button, "off");
    });

}

// Recursive for on and off leds
function sequence(counterSeq) {
    var pin = random[counterSeq];

    chosen.push(leds.led[pin].pin);

    board.wait(TIME, function(){
        sound(pin);
        leds.led[pin].on();
        board.wait(TIME, function(){
            leds.led[pin].off();

            if(counterSeq < (leds.total - 1)) {
                counterSeq++;
                sequence(counterSeq);
            }
            else {
                // MY DEBUGGER
                myDebugger("chosen", chosen);
            }
        });
    });
}

// Press and release button for on/off the led
function pressAndRelease(button, flag) {
    switch(button.pin) {
        case btnGreen:
            flag === "on" ? (leds.led[0].on(), sound(0)) : leds.led[0].off();
            break;
        case btnYellow:
            flag === "on" ? (leds.led[1].on(), sound(1)) : leds.led[1].off();
            break;
        case btnRed:
            flag === "on" ? (leds.led[2].on(), sound(2)) : leds.led[2].off();
            break;
        case btnWhite:
            flag === "on" ? (leds.led[3].on(), sound(3)) : leds.led[3].off();
            break;
        default:
            console.log("ERROR in function pressAndRelease!");
            break;
    }
}

function sound(position) {
    piezo.play({
        song: notes[position],
        beats: 1 / 4,
        tempo: 100
    });
}

// Random number from zero to four (excluded five)
function gerRandom() {
    return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
}

// Leds on/off
function ledsOff(button) {
    leds.led[0].on();
    leds.led[1].on();
    leds.led[2].on();
    leds.led[3].on();

    board.wait(TIME, function() {
        leds.led[0].off();
        leds.led[1].off();
        leds.led[2].off();
        leds.led[3].off();
    });
}

/*
    Responsibles for debugger
*/

function myDebugger(goDebugger, options) {
    if(goDebugger === "btnPress") {
        console.log("The colors pressed are");
        whatColors(options).forEach(function(color) {
            console.log(color);
        });
        console.log("\n");
    }
    else if(goDebugger === "chosen") {
        console.log("The colors of the sequence are");
        whatColors(options).forEach(function(color) {
            console.log(color);
        });
        console.log("\n");
    }
    else {
        console.log("Error debugger")
    }
}

function whatColors(pins) {
    var colors = [];

    // Buttons and Leds
    pins.forEach(function(pin) {
        if(pin === btnWhite || pin === ledWhite) {
            colors.push("White");
        }
        else if(pin === btnRed || pin === ledRed) {
            colors.push("Red");
        }
        else if(pin === btnYellow || pin === ledYellow) {
            colors.push("Yellow");
        }
        else if(pin === btnGreen || pin === ledGreen) {
            colors.push("Green");
        }
        else {
            console.log("Error whatColors");
        }
    });

    return colors;
}
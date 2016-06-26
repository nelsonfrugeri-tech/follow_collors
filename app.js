"use strict";

var five     = require('johnny-five');
var board    = new five.Board();
const TIME   = 2000;
const MOVE   = 20;
var chosen   = [];
var amount   = 0;
var random   = [];
var array    = null;
var leds     = {};
var btnPress = [];
var counter  = 0;
var buttons  = null;


// Responsible for create leds, buttons and load function start and eventButtons
board.on("ready", function() {
    // Create leds
    array = new five.Leds([5, 4, 3, 2]);
    leds  = {
        led: array
    };
    // Create buttons
    buttons = new five.Buttons({
        pins: [13, 12, 11, 10],
        isPullup: true
    });

    start();
    eventButtons();
});

/*
    Check if there is move, case yes then initialize variables and generate randowm number
    for next sequence
*/
function start() {
    if(amount <= MOVE) {
        // For buttom event
        btnPress    = [];
        counter     = 0;
        // For sequence event
        chosen      = [];
        random      = gerRandom(++amount);
        leds.amount = random.length;

        console.log(" *--- Move " + amount + "---* \n");
        sequence();
    }
    else {
        console.log("*--- Glorious in Victory ---*");
    }
}

function gameOver() {
    ledsOff();
    console.log("Game Over");

    setTimeout(function(){
        process.exit(1);
    }, TIME);
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
            case 2:
                if(btnPress[i] !== 10) {
                    gameOver();
                }
                break;
            // Red
            case 3:
                if(btnPress[i] !== 11) {
                    gameOver();
                }
                break;
            // Yellow
            case 4:
                if(btnPress[i] !== 12) {
                    gameOver();
                }
                break;
            // Green
            case 5:
                if(btnPress[i] !== 13) {
                    gameOver();
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
function sequence() {
    var amount = leds.amount;
    var pin    = random[amount - 1];

    chosen.push(leds.led[pin].pin);

    board.wait(TIME, function(){
        leds.led[pin].on();
        board.wait(TIME, function(){
            leds.led[pin].off();
            amount = --leds.amount;

            if(amount >= 1) {
                sequence();
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
        case 13:
            flag === "on" ? leds.led[0].on() : leds.led[0].off();
            break;
        case 12:
            flag === "on" ? leds.led[1].on() : leds.led[1].off();
            break;
        case 11:
            flag === "on" ? leds.led[2].on() : leds.led[2].off();
            break;
        case 10:
            flag === "on" ? leds.led[3].on() : leds.led[3].off();
            break;
        default:
            console.log("ERROR in function pressAndRelease!");
            break;
    }
}

// Random numbers from zero to four (excluded five)
function gerRandom(amount) {
    var random = [];

    for(var i = 0; i < amount; i++) {
        random.push(Math.floor(Math.random() * (3 - 0 + 1)) + 0);
    }

    return random;
}

// Leds on/off
function ledsOff(button) {
    leds.led[0].on();
    leds.led[1].on();
    leds.led[2].on();
    leds.led[3].on();
    leds.led[0].off();
    leds.led[1].off();
    leds.led[2].off();
    leds.led[3].off();
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
        if(pin === 10 || pin === 2) {
            colors.push("White");
        }
        else if(pin === 11 || pin === 3) {
            colors.push("Red");
        }
        else if(pin === 12 || pin === 4) {
            colors.push("Yellow");
        }
        else if(pin === 13 || pin === 5) {
            colors.push("Green");
        }
        else {
            console.log("Error whatColors");
        }
    });

    return colors;
}
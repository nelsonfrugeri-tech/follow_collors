"use strict";

var five     = require('johnny-five');
var board    = new five.Board();
const TIME   = 2000;
var chosen   = [];
var amount   = 0;
var random   = [];
var array    = null;
var leds     = {};
var btnPress = [];
var counter  = 0;
var buttons  = null;

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

function start() {
    if(amount <= 20) {
        // For buttom event
        btnPress    = [];
        counter     = 0;
        // For led event
        chosen      = [];
        random      = gerRandom(++amount);
        leds.amount = random.length;

        console.log("Game "+amount);
        ledOnOff();
    }
    else {
        console.log("Glorious in Victory!")
    }
}

function gameOver() {
    console.log("Game Over");
}

function match() {
    for(var i = 0; i < amount; i++) {
        switch (chosen[i]) {
            // White
            case 2:
                if(btnPress[i] !== 10) {
                    gameOver();
                    return false;
                }
                break;
            // Red
            case 3:
                if(btnPress[i] !== 11) {
                    gameOver();
                    return false;
                }
                break;
            // Yellow
            case 4:
                if(btnPress[i] !== 12) {
                    gameOver();
                    return false;
                }
                break;
            // Green
            case 5:
                if(btnPress[i] !== 13) {
                    gameOver();
                    return false;
                }
                break;
            default:
                console.log("Error in function match");
                break;
        }
    }

    setTimeout(function(){
        start();
    }, TIME);
}

function eventButtons() {
    buttons.on("press", function(button) {
        pressAndRelease(button, "on");

        if(counter < amount) {
            btnPress.push(button.pin);
            counter++;
        }

        console.log("btnPress");
        console.log(btnPress);

        if(counter === amount) {
            match();
        }
    });

    buttons.on("release", function(button) {
        pressAndRelease(button, "off");
    });

}

// Recursive for on and off leds
function ledOnOff() {
    var amount = leds.amount;
    var pin    = random[amount - 1];

    chosen.push(leds.led[pin].pin);

    board.wait(TIME, function(){
        leds.led[pin].on();
        board.wait(TIME, function(){
            leds.led[pin].off();
            amount = --leds.amount;

            if(amount >= 1) {
                ledOnOff();
            }
            else {
                console.log("chosen");
                console.log(chosen);
            }
        });
    });
}

// Press and release buttom
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
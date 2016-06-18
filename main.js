var five   = require('johnny-five');
var board  = new five.Board();
var chosen = [];
var amount = 4;
var random = gerRandom(amount);

board.on("ready", function() {
    var array = new five.Leds([5, 4, 3, 2]);
    var leds  = {
        led: array,
        amount: random.length
    };

    ledOnOff(eventButtons, leds, 2000);
});

function gameOver() {
    console.log("Game Over!");
}

function match(btnPress) {
    for(var i = 0; i < amount; i++) {
        switch (chosen[i]) {
            case 2:
                if(btnPress[i] !== 10) {
                    gameOver();
                    return false;
                }
                break;
            case 3:
                if(btnPress[i] !== 11) {
                    gameOver();
                    return false;
                }
                break;
            case 4:
                if(btnPress[i] !== 12) {
                    gameOver();
                    return false;
                }
                break;
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

    console.log("Glorious Victory!");
}

function eventButtons(leds) {
    var btnPress = [];
    var counter  = 0;
    // Create buttons
    var buttons = new five.Buttons({
        pins: [13, 12, 11, 10],
        isPullup: true
    });

    buttons.on("press", function(button) {
        pressAndRelease(button, leds, "on");

        if(counter < amount) {
            btnPress.push(button.pin);
            counter++;
        }

        if(counter === amount) {
            match(btnPress);
            return false;
        }
    });

    buttons.on("release", function(button) {
        pressAndRelease(button, leds, "off");
    });

}

// Recursive for on and off leds
function ledOnOff(eventButtons, leds, time) {
    var amount = leds.amount;
    var pin    = random[amount - 1];

    chosen.push(leds.led[pin].pin);
    leds.led[pin].on();

    board.wait(time, function(){
        leds.led[pin].off();

        board.wait(time, function(){
            amount = --leds.amount;

            if(amount >= 1) {
                ledOnOff(eventButtons, leds, time);
            }
            else {
                eventButtons(leds);
                return false;
            }
        });
    });
}

// Press and release buttom
function pressAndRelease(button, leds, flag) {
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
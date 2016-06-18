var five  = require('johnny-five');
var board = new five.Board();

board.on("ready", function() {
    var random = gerRandom(4);
    var array  = new five.Leds([5, 4, 3, 2]);
    var leds   = {
        led: array,
        amount: random.length
    };

    // console.log("leds");
    // console.log(leds);

    // console.log("random");
    // console.log(random);

    ledOnOff(leds, random, 2000);

    // board.loop(1000, test);
});

// Random numbers from zero to four (excluded five)
function gerRandom(amount) {
    var random = [];

    for(var i = 0; i < amount; i++) {
        random.push(Math.floor(Math.random() * (3 - 0 + 1)) + 0);
    }
    console.log(random);
    return random;
}

// Recursive for on and off leds
function ledOnOff(leds, random, time) {
    var amount = leds.amount;
    var pin    = random[amount - 1];

    leds.led[pin].on();

    board.wait(time, function(){
        leds.led[pin].off();

        board.wait(time, function(){
            amount = --leds.amount;

            if(amount >= 1)
                ledOnOff(leds, random, time);
        });
    });
}


function test() {
    var test = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    console.log(test);
}


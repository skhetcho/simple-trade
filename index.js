const request = require("request");

//currency url
var url = "https://api.nomics.com/v1/currencies/ticker?key=49a161116bf1448f62a39357feee180a&ids=BTC&interval=1d,30d&convert=USD";

var capital = 100;
var priceBoughtAt = 0;
var priceSoldAt = 0;
var oneSecondPrice = pricePerSecond(); //Price Every Second. Reason for calling the function here was to invoke the first value and not crash because it's null
var flucturationRate = 0.00005; //0.005% difference
var winnings = 0.00000000;
let buy = true;
let sell = false

function pricePerSecond() {
    request.get(url, (error, response, body) => {
        let json = JSON.parse(body);
        oneSecondPrice = Number(json[0].price);
    });
}

function currentPricing() {
    request.get(url, (error, response, body) => {
        let json = JSON.parse(body);

        //Number(json[0].price) is the instant price or current price
        //compare current price with price per minute to decide where to buy or see
        if (Number(json[0].price) <= (oneSecondPrice * (1 - flucturationRate))) {
            //buy
            //you can't sell because you have USD, you can buy because you have USD
            if(sell === false && buy === true){
                console.log("invoke buy at: " + Number(json[0].price))
                priceBoughtAt = Number(json[0].price)
                buy = false;
                sell = true;
            }
            
        }
        else if (Number(json[0].price) >= (priceBoughtAt * (1 + flucturationRate))){
            //sell
            //you can't buy because you have USD, you can sell because you have BTC
            if(buy === false && sell === true){
                console.log("invoke sell at: "  + Number(json[0].price))
                priceSoldAt = Number(json[0].price);
                // winnings = winnings + (((100 * priceSoldAt) / priceBoughtAt) - 100);
                winnings = winnings + (((capital * priceSoldAt) / priceBoughtAt) - capital);
                capital = capital + (((capital * priceSoldAt) / priceBoughtAt) - capital);
                buy = true;
                sell = false
            }

        }
    });
}
setInterval(currentPricing, 250);
setInterval(pricePerSecond, 1000)
function reportWinnings() {
    console.log('\x1b[36m%s\x1b[0m',"winnings: " + winnings);
    console.log('\x1b[36m%s\x1b[0m', "current capital: " + capital,)
}

setInterval(reportWinnings, 3000);

// var ON_DEATH = require('death'); //this is intentionally ugly
 
// ON_DEATH(function(signal, err) {
  
// })
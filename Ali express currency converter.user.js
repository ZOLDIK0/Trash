// ==UserScript==
// @author       ME (BA DO)
// @name         Ali express currency converter
// @description  converts euro to DZD in aliexpress.com,
//               Make sure the currency is set to EUR or USD,
//               You can use hotkeys (alt+shift), (ctrl+alt),
//               You can add more currencies in the get_currency_parser() function,
//               You can change the currency by modifying the variable 'currency_symbol'
// @version      1.1
// @match        https://*.aliexpress.com/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js
// @updateURL    https://github.com/ZOLDIK0/Trash/raw/master/Ali%20express%20currency%20converter.user.js
// ==/UserScript==

// changable variables
let currency_convert_ratio = 21300;// change this if you need to. but you won't be able to use ctrl+alt anymore
let target_currency_symbol = "DZ";
let currency_symbol = '$';
function get_currency_parser(currency){
    let eur_currency_parser = function(price){
        return price.replace(/[^\d,]/g,"").replace(",",".");
    }
    let usd_currency_parser = function(price){
        return price.replace(/[^\d.]/g,"");// remove all non numeric characters and non '.' character
    }
    // Add more currency handlers here
    switch(currency_symbol){
        case '€':
            return eur_currency_parser;
        case '$':
            return usd_currency_parser;
    }
}
// --END

let currency_cookie = "sd6sd1v1s5d15a8asd8rey8t4y92vs5d1fdFFF";
let wlcm_cookie = "s2d1d6vs5sd1v1s15a8asd8rey5d8t4y9fdFFF";
if(!Cookies.get(wlcm_cookie)||Cookies.get(wlcm_cookie)!="1"){
    Cookies.set(wlcm_cookie, "1", {expires:100, domain:'.aliexpress.com'});
    alert("Ali Express Converter Script\nHello, this is Your first time using the script\nplease note that the script does not collect any information what so ever\nYou can switch from normal currency and converted currency using the hotkey [ctrl+alt]\nYou can change the convertion price by the hotkey [ctrl+alt]");
}

if(Cookies.get(currency_cookie)){
    euro_to_dz = parseInt(Cookies.get(currency_cookie));
}
let revert = false;
let oldelements = [];
let newelements = [];
let timer;

let parseCurrency = get_currency_parser();

convertPrices();
 function convertPrices(){
     if(revert || !document){
         timer = setTimeout(convertPrices,1000);
         return;
     }
     if(window.location.href.includes("aliexpress.com/store")){
         for(var e of document.querySelectorAll("[numberoflines='1']")){
            let price = e.innerHTML;
             if(!price.startsWith(currency_symbol))
                continue;
            if(!price.endsWith(target_currency_symbol)){
             oldelements.push({element:e,value:price});
             price = price.substr(price.indexOf("-"));
             price = ""+convert(parseCurrency(price))+" "+target_currency_symbol;
             newelements.push({element:e,value:e.innerHTML});
             e.innerHTML = price
           }
         }
     }
    for(var e of document.querySelectorAll(".current-price-util-left, .current-price, .crowd-price, .detail-price, .product-price-value, .line-limit-length > span:nth-child(1), .detail-oriprice, .amount-num, .product-amount >span:nth-child(1), .main-cost-price, .extend-price.del, .total-price>dl>dd, .charges-totle>dd, .charge-cost, .total-cost")){
        let price = e.innerHTML;
        if(!price.endsWith(target_currency_symbol)){
            oldelements.push({element:e,value:price});
            if(price.indexOf("-")>0)
                price = price.substr(price.indexOf("-"));// take only max value from ranges
            price = ""+convert(parseCurrency(price))+" " + target_currency_symbol;
            newelements.push({element:e,value:e.innerHTML});
            e.innerHTML = price;
        }
    }
    timer = setTimeout(convertPrices,1000);
}
function convert(price) {
    price = currency_convert_ratio * parseFloat(price) / 1000;
    var unit = "K";
    if(price/1000000>1){
        unit = "MIL";
        price /= 1000000;
    }else if(price/1000>1){
        unit = "M";
        price /= 1000;
    }else if(price<1){
        unit = "";
        price *=1000;
    }
    var parts = (Math.round(price * 10) / 10).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".")+unit;
}
window.onkeydown = function(event){
    if(event.ctrlKey && event.shiftKey){
        if(!revert){
           for(let target of oldelements)
            target.element.innerHTML = target.value;
        }else{
            for(let target of newelements)
                target.element.innerHTML = target.value;
        }
        revert = !revert;
    }
    if(event.ctrlKey && event.altKey){
        let val = window.prompt(currency_symbol + " to "+target_currency_symbol+" =?", currency_convert_ratio);
        if(val != (""+parseInt(val))){
           alert("Bad Value: " + val);
        }else{
            Cookies.remove(currency_cookie);
            Cookies.set(currency_cookie, val, {expires:100});
            currency_convert_ratio = parseInt(val);
            for(let target of oldelements)
                target.element.innerHTML = target.value;
        }
    }
}


// ==UserScript==
// @author       Bekkouche Eboubaker
// @name         Ali express currency converter "DZ"
// @version      1.2
// @match        https://*.aliexpress.com/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js
// @updateURL    https://github.com/ZOLDIK0/Trash/raw/master/Ali%20express%20currency%20converter%20_DZ_.user.js
// ==/UserScript==

let euro_to_dz = 21300;// change this if you need to. but you won't be able to use ctrl+alt anymore


let cookie = "sd6sd1v1s5d15a8asd8rey8t4y92vs5d1fdFFF";
let cookievalue = Cookies.get(cookie);
if(cookievalue && cookievalue != "" && euro_to_dz == 21300){
    euro_to_dz = parseInt(cookievalue);
}
let mode = "DZ";
let oldelements = [];
let newelements = [];
let timer;
convertPrices();
 function convertPrices(){
     if(mode != "DZ" || !document){
         timer = setTimeout(convertPrices,1000);
         return;
     }
     if(window.location.href.includes("aliexpress.com/store")){
         for(var e of document.querySelectorAll("[numberoflines='1']")){
            let price = e.innerHTML;
             if(!price.startsWith("€"))
                continue;
            if(!price.endsWith('DZ')){
             oldelements.push({element:e,value:price});
             e.innerHTML = e.innerHTML.substr(e.innerHTML.indexOf("-"));
             e.innerHTML = ""+convert(price.replace(/[\$€\s.]/g,"").replace(",","."))+" DZ";
             newelements.push({element:e,value:e.innerHTML});
           }
         }
     }
    for(var e of document.querySelectorAll(".shipping-value, .price-current, .sale-price, .original-price, .price, .list-price, .current-price-util-left, .current-price, .crowd-price, .detail-price, .product-price-value, .line-limit-length > span:nth-child(1), .detail-oriprice, .amount-num, .product-amount >span:nth-child(1), .main-cost-price, .extend-price.del, .total-price>dl>dd, .charges-totle>dd, .charge-cost, .total-cost")){
        let price = e.innerHTML;
        if(!price.endsWith('DZ')){
            oldelements.push({element:e,value:price});
            e.innerHTML = e.innerHTML.substr(e.innerHTML.indexOf("-"));
            let add = "";
            if(e.innerHTML!=price)
                add= "min: ";
            e.innerHTML = add+convert(price.replace(/[A-Za-z\$€:\s.]/g,"").replace(",","."))+" DZ";
            if(price.startsWith("Shipping"))
                e.innerHTML = "Shipping: " + e.innerHTML;
            if(e.innerHTML == "NaNK DZ")
                e.innerHTML = "Free Shipping";
            newelements.push({element:e,value:e.innerHTML});
        }
    }
    timer = setTimeout(convertPrices,1000);
}
function convert(price) {
    price = euro_to_dz * parseFloat(price) / 1000;
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
        if(mode == "DZ"){
           for(let target of oldelements)
            target.element.innerHTML = target.value;
           mode = "";
        }else{
            for(let target of newelements)
                target.element.innerHTML = target.value;
            mode = "DZ";
        }
    }
    if(event.ctrlKey && event.altKey){
        let val = window.prompt("Euro to DZ =?", euro_to_dz);
        if(val != (""+parseInt(val))){
           alert("Bad Value: " + val);
        }else{
            Cookies.remove(cookie);
            Cookies.set(cookie, val, {expires:100});
            euro_to_dz = parseInt(val);
            for(let target of oldelements)
            target.element.innerHTML = target.value;
        }
    }
}
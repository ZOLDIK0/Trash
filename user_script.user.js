// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.aliexpress.com/*
// @grant        none
// ==/UserScript==

let euro_to_dz = 21300;
let mode = "DZ";
let oldelements = [];
let newelements = [];
window.onload = convertPrices;
 function convertPrices(){
    if(mode != "DZ"){
       setTimeout(convertPrices, 1000);
        return;
    }
    for(var e of document.querySelectorAll(".current-price-util-left, .current-price, .crowd-price, .detail-price, .product-price-value, .line-limit-length > span:nth-child(1), .detail-oriprice, .amount-num, .product-amount >span:nth-child(1)")){
        let price = e.innerHTML;
        if(!price.endsWith('DZ')){
            oldelements.push({element:e,value:price});
            e.innerHTML = ""+convert(price.replace(/[\$€\s]/g,"").replace(",","."))+" DZ";
            newelements.push({element:e,value:e.innerHTML});
        }
    }
    setTimeout(convertPrices, 1000);
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
window.addEventListener("keyup", function(event){
    if(event.code=="ControlLeft"){
        if(mode == "DZ"){
           for(let target of oldelements)
            target.element.innerHTML = target.value;
           mode = "vv";
        }else{
            for(let target of newelements)
                target.element.innerHTML = target.value;
            mode = "DZ";
        }
    }
});

// ==UserScript==
// @name         IGG-Games adblock-blocker killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  destroys the pop up (please disable your adblocker bla bla bal....)
// @author       Me(BA DO)
// @match        https://igg-games.com/*
// ==/UserScript==

(function start(){
    var elem = document.querySelector('#idModal');
    if(elem != null && elem.parentNode != null && elem.parentNode.className == ''){
        elem.parentNode.remove();
        var rem = document.getElementsByTagName('iframe');
        while(rem[0] != null){
           rem[0].remove();
           rem = document.getElementsByTagName('iframe');
        }
    }else{
        setTimeout(start, 200);
    }
})();
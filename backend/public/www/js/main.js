/*
Copyright (c) 2022, savage-unic0rn
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 
*/

var host = document.location.host;
var protocol= document.location.protocol;

//DETECTAR MOVIL
var pos_x_mouse, pos_y_mouse;
var mobile = false;
let navegador = navigator.userAgent;
if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    mobile = true;
}

//IDs INICIALIZAR
var tp = document.getElementById('tp');
var click = document.getElementById('cizq');
var rightClick = document.getElementById('cdch');
var scroll_web = document.getElementById('sv');
var scroll_lateral = document.getElementById('sh');
var keyboard_text = document.getElementById('keyboard_text');
var sendEnter = document.getElementById('send');
var sendDel = document.getElementById('del');

// LISTENERS
if(mobile){
    tp.addEventListener('touchmove', detectarMovimiento);
    scroll_web.addEventListener('touchmove', detectarScrollVertical);
    scroll_lateral.addEventListener('touchmove', detectarScrollLateral);

    tp.addEventListener('touchend', reiniciarMovimiento);
    scroll_web.addEventListener('touchend', reiniciarMovimiento);
    scroll_lateral.addEventListener('touchend', reiniciarMovimiento);
} else {
    tp.addEventListener('mousemove', detectarMovimiento);
    scroll_web.addEventListener('mousemove', detectarScrollVertical);
    scroll_lateral.addEventListener('mousemove', detectarScrollLateral);
}
click.addEventListener('click', makeClick);
rightClick.addEventListener('click', makeRightClick);
sendEnter.addEventListener('click', makeEnter);
sendDel.addEventListener('click', makeDel);


function send(method, url, json) {

    if(!url) throw "URL error"

    if(!json) json = false;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
    }
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    if(json){
        xhttp.send(JSON.stringify(json));
    } else {
        xhttp.send(JSON.stringify({status:'OK'}));
    }
    
}

function makeClick(event){
    send('POST', '/click');
}
function makeRightClick(event){
    send('POST', '/rightClick');
}

function makeEnter(event){
    var texto = keyboard_text.value;   

    if (texto != null) {
        var json = {
            text: texto,
        }
        send('POST', '/write', json);
        keyboard_text.value = null;
    } else {
        var json = {
            opt_pos: 0,
        }
        send('POST', '/keyboard-opts', json); 
    }

}
function makeDel(event){
    var json = {
        opt_pos: 1
    }
    send('POST', '/keyboard-opts', json);
}

var pos_anterior = {intervaloMovimiento:0};
var intervaloMovimiento;
function reiniciarMovimiento(){
    pos_anterior = {intervaloMovimiento:0};
    if(intervaloMovimiento){
        clearInterval(intervaloMovimiento);
    }
}
function diferencia_valores(event, search, id){
    var pos_actual;
    if(mobile){
        pos_actual = Math.round(search == 'Y' ? event.touches[0].clientY : event.touches[0].clientX);
    } else {
        pos_actual = search == 'Y' ? event.clientY : event.clientX;
    }

    if(pos_anterior[id]) { //Si existe
        var calc= pos_actual - pos_anterior[id];       
        pos_anterior[id] = undefined;

        var json = search == 'Y' ? { pos_y: calc } : { pos_x: calc };
        return json;

    } else { //Si no existe
        pos_anterior[id] = pos_actual;
        return false;
    }
}

var json_obj = {};
function  addJSON(json, id){
    if(!json_obj[id]) {json_obj[id] = json}
    else {
        if(json.pos_x){
            json_obj[id].pos_x += json.pos_x;
        }
        if(json.pos_y){
            json_obj[id].pos_y += json.pos_y;
        }
    }
}

function detectarMovimiento(event){
    var id = {x: 'x1', y:'y1'}
    var json = diferencia_valores(event, 'X', id.x);
    var json_y = diferencia_valores(event, 'Y', id.y);
    if(json){
        json.pos_y = json_y.pos_y;
        send('POST', '/move', json);
    }
}

function detectarScrollVertical(event){
    var id = 'y2';
    var json = diferencia_valores(event, 'Y', id);
    if(json){
        if(!json_obj[id]){
            if(pos_anterior.intervaloMovimiento != intervaloMovimiento){
                console.log('creamos intervalo:' + intervaloMovimiento+1);
                intervaloMovimiento = setTimeout(function (){
                    send('POST', '/scroll', json_obj[id]);
                    json_obj[id] = {};
                    console.log('eliminamos intervalo:' + intervaloMovimiento);
                }, 250);
                pos_anterior.intervaloMovimiento = intervaloMovimiento
            }        
        }
        addJSON(json, id);
    }
}

function __detectarScrollVertical(event){
    var id = 'y2';
    var json = diferencia_valores(event, 'Y', id);
    if(json){
        send('POST', '/scroll', json);
    }
}

function detectarScrollLateral(event){
    var id = 'x2';
    var json = diferencia_valores(event, 'X', id);
    if(json){
        send('POST', '/scroll-lat', json);
    }
}
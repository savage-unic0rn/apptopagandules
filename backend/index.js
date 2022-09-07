/*
Copyright (c) 2022, savage-unic0rn
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 
*/
const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 3000;
var bodyParser  = require('body-parser');

// Deshabilitamos esta informacion que se envia al cliente por seguridad
app.disable('x-powered-by');

// Sin esto no puede acceder a las variables req y res
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());


var path        = require('path');
var serveStatic = require('serve-static');
global.appRoot = path.resolve(__dirname);

app.use('/public', serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  var webURL = '/public/www/index.html';
  res.sendFile( appRoot  + webURL );
})

// KEYBOARD

app.post('/write', (req, res) => {
  var text = req.body.text;
  // Remplazamos caracteres problematicos
  text = text.replaceAll('+','{ADD}');

  exec(`.\\mouse.bat keyboardWrite "${text}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.end();
})

app.post('/keyboard-opts', (req, res) => {
  // Obtenemos la accion a realizar por el teclado
  var pos = req.body.opt_pos;
  var opt = ['keyboardEnter', 'keyboardDel'];
  
  exec(`.\\mouse.bat ${opt[pos]}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.end();
})



// MOUSE
  /*
    dragBy NxM
    dragTo NxM
  */

app.post('/move', (req, res) => {
  var pos_x = req.body.pos_x;
  var pos_y = req.body.pos_y;
  console.log(`(${pos_x},${pos_y})`);

  exec(`.\\mouse.bat moveBy ${pos_x}x${pos_y}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.end();
})


app.post('/click', (req, res) => {

  exec(`.\\mouse.bat click`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  res.end();
})

app.post('/rightClick', (req, res) => {

  exec(`.\\mouse.bat rightClick`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  res.end();
})


app.post('/scroll', (req, res) => {
  var scroll = req.body.pos_y;
  console.log(`scroll: ${scroll}`);
  if(scroll>0){
    exec(`.\\mouse.bat scrollUp ${scroll}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } else {
    scroll = Math.abs(scroll);
    exec(`.\\mouse.bat scrollDown ${scroll}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
  res.end();
})

app.post('/scroll-lat', (req, res) => {
  var scroll = req.body.pos_x;
  console.log(`scroll lat: ${scroll}`);
  if(scroll>0){
    exec(`.\\mouse.bat keyboardLeft ${scroll}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } else {
    scroll = Math.abs(scroll);
    exec(`.\\mouse.bat keyboardRight ${scroll}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
  res.end();
})

/*
// Quitamos el doubleClick porque podemos hacer la misma funcionalidad pasando dos Clicks normales y evitar programar esta parte
app.post('/doubleClick', (req, res) => {

  exec(`.\\mouse.bat doubleClick`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  res.end();
})
*/


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
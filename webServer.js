
var fs = require('fs');
var express = require('express');


var port = require('./readPort');

var app = express();
var server = app.listen(3000, running);

function running(){
  console.log("running...");
}
app.use(express.static('gui'));

// experiment init
var temp = fs.readFileSync('./gui/expSetup.json');
var expSetup = JSON.parse(temp);
console.log(expSetup);


app.get('/add/:key/:value', addKey);
function addKey(req, res){
  var data = req.params;
  var key = data.key;
  var value = data.value;

  expSetup[key] = value;

  var dd = JSON.stringify(expSetup, null, 2);
  fs.writeFileSync('./gui/expSetup.json', dd);

  var reply = {
    msg : "eklendi"
  }
  res.send(reply)
}

app.get('/all', save);
function save(req, res){
  res.send(expSetup);
};


// port reading start-stop from gui
var tstatus = fs.readFileSync('./gui/status.json');
var status = JSON.parse(tstatus);
console.log(status);

app.get('/all/status', save);
function save(req, res){
  res.send(status);
};

app.get('/stat/:key/:value', cstatus);
function cstatus(req, res){
  var data = req.params;
  var key = data.key;
  var value = data.value;

  status[key] = value;
  if (value == "START"){
    port();
  }
  var dd = JSON.stringify(status, null, 2);
  fs.writeFileSync('./gui/status.json', dd);
  var reply = {
    msg : "tamamdır"
  }
  res.send(reply)
}

// saved experiment data directory list
app.get('/expDir', getExpDir);
function getExpDir(req, res){
  let dirJson = {};
  let dir = fs.readdirSync('./gui/expData/');
  dirJson['exp'] = dir
  res.send(dirJson)
};


// sensor init
var sensors ={};
app.get('/sensor/:key/:value', addSensor);
function addSensor(req, res){
  let data = req.params;
  let key = data.key;
  let value = data.value;

  sensors[key] = value;

  let dd = JSON.stringify(sensors, null, 2);
  fs.writeFileSync('./gui/config.json', dd);

  var reply = {
    msg : "eklendi"
  }
  res.send(reply)
}

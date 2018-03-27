//server

var tStep = 0;
var j = 0

var fs = require('fs');


var SerialPort = require('serialport');
var port = new SerialPort('COM3' , {
  baudRate: 9600,
});

// read local json file
var temps = fs.readFileSync('./gui/data.json');
var tempData = JSON.parse(temps);
console.log(tempData);

//read config file
var rawConf = fs.readFileSync('config.json');
var conf = JSON.parse(rawConf);
console.log(conf);

// time data
var now = Date.now();
fs.writeFileSync('./time.txt', now);
var rawTime = fs.readFileSync('./time.txt');
var timeData = rawTime.toString()
console.log(timeData);

// reset data.csv file when start
var csvkeys = "time,id,temp\r\n"
//fs.writeFileSync('./gui/data.csv', csvkeys);

//open port
port.on("open", readPort );

function readPort(){
    // check open port errors
    port.write('main screen turn on', function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('reading port...');
    });

 // read port
  port.on('data', function (bufferData) {
    // conver buffer data to string
    var data = bufferData.toString().replace('\r\n', ' ');
    console.log(data);

    // split id and temp
    var splitData = data.split(':')
    var id = splitData[0];
    var temp = splitData[1];

    // config
    var tempId = conf[id];

  //console.log(tempId);

    // write data to json file
    tempData[tempId] = temp;
    var writeData = JSON.stringify(tempData, null, 2);
    fs.writeFileSync('./gui/data.json', writeData);

    // write data to csv
    var time = Date.now();

    var rawTime = fs.readFileSync('./time.txt');
    var timeData = rawTime.toString()
    //console.log(timeData);

    var diff = time - timeData;
    console.log(diff);
    console.log(j);
    if (diff > 2000  && j > 1 ){
     tStep = tStep + 5;
      }


    fs.writeFileSync('./time.txt', time);

    var csvData = time + "," +tempId +","+ temp + "\r\n";
//var csvData ="time:"+ time + ",id:" + id +","+"temp:"+ temp + "\r\n";
    fs.appendFileSync('./gui/data.csv', csvData);
    j++
    
    //
    // if (j == 2){
    //   port.close();
    // }

  });
};

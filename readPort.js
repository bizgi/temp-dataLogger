//server

function portReader(){

var tStep = 0;
var j = 0

var fs = require('fs');

var SerialPort = require('serialport');

var sensorInit = {};

// read local json file
var temps = fs.readFileSync('./gui/data.json');
var tempData = JSON.parse(temps);
console.log(tempData);



//read epxeriment setup file
var rawExp = fs.readFileSync('./gui/expSetup.json');
var expSetup = JSON.parse(rawExp);
console.log(expSetup);

// create experiment data folder
var dirName = expSetup["expName"];
console.log(dirName);
 var dir = './gui/expData/'+ dirName;
 if (!fs.existsSync(dir)){
     fs.mkdirSync(dir);
 };

 // reset data.csv file when start
 var csvkeys = "time,id,temp\r\n"
 fs.writeFileSync('./gui/expData/' + dirName +'/data.csv', csvkeys);

// time data
var now = Date.now();
fs.writeFileSync('./time.txt', now);
var rawTime = fs.readFileSync('./time.txt');
var timeData = rawTime.toString()
// console.log(timeData);


var portName;
SerialPort.list(function (err, ports) {
    if (err) {
        throw err;
    }
    ports.forEach(function(portNames) {
      // console.log(port.comName);
      portName = portNames.comName.toString();

      var port = new SerialPort(portName, {
        baudRate: 9600,
      });

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

          // start - stop port reading form gui
          var statust = fs.readFileSync('./gui/status.json');
          var status = JSON.parse(statust);
          //console.log(status);

          //read config file - sensor ids and names
          var rawConf = fs.readFileSync('./gui/config.json');
          var conf = JSON.parse(rawConf);
          // console.log(conf);

          if (status["status"] == "STOP"){
            port.close();
          };

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

          // Sensor Init
          sensorInit[id] = temp;
          let writeSensorInit = JSON.stringify(sensorInit, null, 2);
          fs.writeFileSync('./gui/sensorInit.json', writeSensorInit);

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

          var csvData = time + "," + tempId +","+ temp + "\r\n";

      //var csvData ="time:"+ time + ",id:" + id +","+"temp:"+ temp + "\r\n";
        //fs.mkdirSync('./gui/de1');

        fs.appendFileSync('./gui/expData/' + dirName +'/data.csv', csvData);
          j++
        });
      };

    });

 });



};
module.exports = portReader;
// portReader()

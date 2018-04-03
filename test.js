var d = [20,25,30];

var fs = require('fs');

var time = "15";
var id = ["t1", "t2", "t3"]


var rjdata = fs.readFileSync('test.json')
var jdata = JSON.parse(rjdata);
var p = {}
for (let i=0; i<d.length; i++){

  p[id[i]] = d[i]
  jdata[time] = p

  jsdata = JSON.stringify(jdata,null,2)
  fs.writeFileSync('test.json', jsdata)

}


// $.getJSON("all/status", gotData);
//   function gotData(data){
//     console.log(data);
//     document.getElementById('status').innerHTML = data["status"];
//
//   }

window.onload=function() {
  // start - stop port reading
  if (bt = document.getElementById("btn") != null){
    var bt = document.getElementById("btn");
    //console.log(bt);
    bt.addEventListener("click",function(e){ submitStatus(); },false);
  }

  function submitStatus(){
   //console.log(val);
    var val = document.getElementById('btn').value;
    $.getJSON("stat/status/" + val);

    var currentvalue = document.getElementById('btn').value;
    if(currentvalue == "STOP"){
      document.getElementById("btn").value="START";
    }else{
      document.getElementById("btn").value="STOP";
    };

    window.location.replace("./dash.html");

  };


  // stop experiment from dash window
  if (sbt = document.getElementById("sbtn") != null){
    var sbt = document.getElementById("sbtn");
    //console.log(bt);
    sbt.addEventListener("click",function(e){ stopExp(); },false);


    $.getJSON("./status.json", gotData);
      function gotData(data){
        console.log(data);
        // document.getElementById('status').innerHTML = data["status"];

        let currentvalue =  data["status"];
        if(currentvalue == "STOP"){
          // location = location;
          document.getElementById("sbtn").value="START";

        }else{
          document.getElementById("sbtn").value="STOP";
        }
      };

    function stopExp(){
     //console.log(val);
      let val = document.getElementById('sbtn').value;
      $.getJSON("stat/status/" + val);

      $.getJSON("./status.json", gotData);
        function gotData(data){
          console.log(data);
          // document.getElementById('status').innerHTML = data["status"];

          let currentvalue =  data["status"];
          if(currentvalue == "STOP"){
            location = location;
            document.getElementById("sbtn").value="START";
          }else{
            document.getElementById("sbtn").value="STOP";
          };
        }
    };
  };


  // inint experiment-----------------------------------

  if (document.getElementById("init") != null){
  // load current exp setup into form
    $.getJSON("./expSetup.json", gotSetup);
      function gotSetup(data){
        // console.log(data);
        document.getElementById("expName").placeholder = data['expName'];
        document.getElementById("expTimeStep").placeholder = data['expTimeStep'];
        document.getElementById("expTotalTime").placeholder = data['expTotalTime'];
        document.getElementById("expHotInletFlowRate").placeholder = data['expHotInletFlowRate'];
        document.getElementById("expColdInletFlowRate").placeholder = data['expColdInletFlowRate'];
      };

    // init button
    var init = document.getElementById("init");
    //console.log(bt);
    init.addEventListener("click",function(e){ initExp(); },false);
  };

  function initExp(){

    var date = new Date();
    var startTime = "-" + date.getFullYear() + "-" + (date.getMonth()+1)+ "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes()
    console.log(startTime);

    var expName = document.getElementById("expName").value + startTime;
    var expTimeStep = document.getElementById("expTimeStep").value;
    var expTotalTime = document.getElementById("expTotalTime").value;
    var expHotInletFlowRate = document.getElementById("expHotInletFlowRate").value;
    var expColdInletFlowRate = document.getElementById("expColdInletFlowRate").value;

    $.getJSON("add/" + "expName/" + expName);
    $.getJSON("add/" + "expTimeStep/" + expTimeStep);
    $.getJSON("add/" + "expTotalTime/" + expTotalTime);
    $.getJSON("add/" + "expHotInletFlowRate/" + expHotInletFlowRate);
    $.getJSON("add/" + "expColdInletFlowRate/" + expColdInletFlowRate);

     document.getElementById("expName").value = null;
     document.getElementById("expName").placeholder = expName;
     document.getElementById("expTimeStep").value = null;
     document.getElementById("expTotalTime").value = null;
     document.getElementById("expHotInletFlowRate").value = null;
     document.getElementById("expColdInletFlowRate").value = null;

     document.getElementById("initExpName").innerHTML = expName;
     document.getElementById("initExpTimeStep").innerHTML = expTimeStep;
     document.getElementById("initTotalTime").innerHTML = expTotalTime;
     document.getElementById("initHotInletFlowRate").innerHTML = expHotInletFlowRate;
     document.getElementById("initColdInletFlowRate").innerHTML = expColdInletFlowRate;


  };


   // Sensor Names Init---------------------------------

  if (sensorInitBtn = document.getElementById("sensorInitBtn") != null){
      $("#sensor-area").hide();
     var sensorInitBtn = document.getElementById("sensorInitBtn");
     //console.log(bt);
     sensorInitBtn.addEventListener("click",function(e){ sensorInit(); },false);


   function sensorInit(){
    //console.log(val);

    $("#reading").html('Loading Sensors ...');
     var val = document.getElementById('sensorInitBtn').value;
     $.getJSON("stat/status/" + val);

     var currentvalue = document.getElementById('sensorInitBtn').value;
     if(currentvalue == "STOP"){
       document.getElementById("sensorInitBtn").value="START";
     }else{
       document.getElementById("sensorInitBtn").value="STOP";
     };

     setTimeout(readSensorJson, 5000)
     setInterval(readSensorData, 5000)
     // readSensorData()
     // setTimeout(getSensorNames, 6000)


   };

   // get sensors and create form area for names
   var sId

   function readSensorJson(){
     $.ajax({
         type: 'GET',
         url: './sensorInit.json',
         dataType: 'json',
     		async: false,
     		success:   function (data){
          sId = Object.keys(data);

          let size = Object.keys(data).length;

          let sensors = "";
          for (let i = 0; i < size; i++) {
             sensors +=  "<div class='col-md-4'><p id='sId" + i +  "'></p></div><div class='col-md-4'><p id='sTemp" + i +  "'></p></div><div class='col-md-4'><input class='form-control' id='sName" + i + "'></div>"
         }
         // $("#sensor-names").append(sensors);
         document.getElementById("sensor-names").innerHTML = sensors;

     			}
     });
   };

    function readSensorData(){
     $("#sensor-area").show();
     $("#reading").hide();

     $.getJSON("./sensorInit.json", gotData);
     function gotData(data){
       // let sId = Object.keys(data);
        let temps = Object.values(data);

       for (let j =0; j<sId.length; j++){
          let id = "sId" + j;
          let temp ="sTemp" + j;

          // console.log(id);
          document.getElementById(id).innerHTML = sId[j];
          document.getElementById(temp).innerHTML = temps[j];
        }

      }
    };

    //
    var saveSensorNames = document.getElementById("saveSensorNames");
    saveSensorNames.addEventListener("click",function(e){ getSensorNames(); },false);

    function getSensorNames(){
      for (let i=0; i<sId.length; i++){
        let sName = "sName" + i;
        let gName = [];
        gName[i] = document.getElementById(sName).value;
        $.getJSON("sensor/" + sId[i] + "/" + gName[i]);
      };
    };


console.log(sId);


  }; // sensor ini if






};

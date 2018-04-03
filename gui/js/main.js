
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

  // inint experiment
  if (document.getElementById("init") != null){
  var init = document.getElementById("init");
  //console.log(bt);
  init.addEventListener("click",function(e){ initExp(); },false);
  };

  function initExp(){
    var expName = document.getElementById("expName").value;
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
   // --------------




};


// $.getJSON("all/status", gotData);
//   function gotData(data){
//     console.log(data);
//     document.getElementById('status').innerHTML = data["status"];
//
//   }

window.onload=function() {
  // start - stop port reading
  var bt = document.getElementById("btn");
  //console.log(bt);
  bt.addEventListener("click",function(e){ submitStatus(); },false);

  function submitStatus(){
   //console.log(val);
    var val = document.getElementById('btn').value;
    $.getJSON("stat/status/" + val);

    currentvalue = document.getElementById('btn').value;
    if(currentvalue == "STOP"){
      document.getElementById("btn").value="START";
    }else{
      document.getElementById("btn").value="STOP";
    };
  };

  var init = document.getElementById("init");
  //console.log(bt);
  init.addEventListener("click",function(e){ initExp(); },false);

  function initExp(){
    var expName = document.getElementById("expName").value;
    var expTimeStep = document.getElementById("expTimeStep").value;
    console.log(expName, expTimeStep);
    $.getJSON("add/" + "expName/" + expName );
    $.getJSON("add/" + "expTimeStep/" + expTimeStep );

     document.getElementById("expName").value = null;
     document.getElementById("expTimeStep").value = null;

  };
   //--------------



};

document.addEventListener('DOMContentLoaded', lo);

function lo(){


var layout = {
	//width: 800,
	//height: 600,
	//title: 'Sıcaklık Dağılımı',
	legend: {
		y: 0.5,
		//traceorder: 'reversed',
		font: {size: 26},
	},
	margin:{
		b:150,
		l:150
	},

	xaxis: {
		showgrid: true,
		zeroline: true,
		showline: true,
		ticks: 'inside',
		mirror: 'ticks',
		tick0: 0,
		rangemode: 'tozero',
		autorange: true,
		// multiple plot
		//domain: [0, 0.45],

		title: 'Zaman [dk]',
			tickfont: {
				family: 'Old Standard TT, serif',
				size: 28,
				color: 'black'
			},
			titlefont: {
				//family: 'Courier New, monospace',
				size: 28,
				color: 'black'
			},
		},

	yaxis: {
		showgrid: true,
		zeroline: true,
		showline: true,
		ticks: 'inside',
		mirror: 'ticks',

		title: 'Sıcaklık [<sup>o</sup>C]',
		tickfont: {
			family: 'Old Standard TT, serif',
			size: 28,
			color: 'black',
		},

		titlefont: {
			//	family: 'Courier New, monospace',
				size: 28,
				color: 'black'
				}
	}
}

// get experiment status
var expStatus;
$.getJSON('./status.json', gotStatus);
	function gotStatus(status){
		expStatus = status['status'];
		// console.log(expStatus);
	};

var csv;

// put all saved experiment data into selection form
if (document.getElementById('expDataLoad') != null){
	$.getJSON("/expDir", gotData);
		function gotData(data){
			//console.log('dir', data);
			let expDatas = data['exp'];
			let opts = "";
			for (let i = 0; i < expDatas.length; i++) {
			    opts += "<option value='" + expDatas[i] + "'>" + expDatas[i] + "</option>";
			}
			$("#expDataLoad").append(opts);
		};
}


// load current experiment data
var expTimeStep,
		expTotalTime,
		expHotInletFlowRate,
		expColdInletFlowRate;

$.ajax({
    type: 'GET',
    url: './expSetup.json',
    dataType: 'json',
		async: false,
		success:   function (data){
		    var dir = data["expName"];
				expTimeStep = data["expTimeStep"];
				expTotalTime = data["expTotalTime"];
				expHotInletFlowRate = data["expHotInletFlowRate"];
				expColdInletFlowRate = data["expColdInletFlowRate"];

				csv = "./expData/" + dir + "/data.csv"
				document.getElementById('display').innerHTML = dir;

			}
});

// show saved experiment data
	function show_selected() {
		// location = location;

 	    let value =  $('#expDataLoad').val();
	    document.getElementById('display').innerHTML = value;
			csv = "./expData/" + value + "/data.csv"

			$(document).ready(function(){
					ciz()
			});
	};

if (document.getElementById('selectBtn') != null){
 	document.getElementById('selectBtn').addEventListener('click', show_selected);
};

//console.log(csv);
// var csv = "./data.csv";

function ciz(){

  d3.csv(csv, parsedData);
		function parsedData(data){
			// console.log(data);
 			processData(data)
 		};


	function processData(data) {
		allRows = data;
	   // console.log(allRows);
			//console.log(allRows[0]["id"]);
    var x = [],
				t1_y = [],
		 		t2_y = [],
				t3_y = [];

		//var t_end = Number(allRows[allRows.length-1]["time"]);
		//console.log(t_end);
		var t_end = Number(expTotalTime);
		var timeStep = 0;

	  for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
			//	var formatedTime = new Date(Number(row["time"]));
			//console.log(time);
			//	var time =  Number(row["time"]);
			//x.push(time);

			// x axis values - 5 min
			x.push(timeStep);
			timeStep = timeStep + Number(expTimeStep);

			if (row["id"] == "T1") {
				t1_y.push(row["temp"]);
			};
			if (row["id"] == "T2") {
				t2_y.push(row["temp"]);
			};
			if (row["id"] == "T3") {
				t3_y.push(row["temp"]);
			};
		};

		//console.log(x);
		var plotPoints = [x, t1_y, t2_y, t3_y];

		makePlotly(plotPoints);

		var t_top,
				t_bottom,
				ric = [];

		for (let i=0; i<t1_y.length; i++){
			t_top = t3_y[i];
			t_bottom = t1_y[i]
			ric.push (richardson(t_top, t_bottom));
		};
		console.log('richardson', ric);

	};

	function richardson(t_top, t_bottom){
		const g = 9.81;
		const beta = 0.000247;
		const H = 0.8;
		var V = 0.2;

		var ri = ((g * beta * H * (t_top - t_bottom)) / (V*V)).toFixed(6) ;
		//console.log(ri);
		return ri
	};


function makePlotly(plotPoints){
		// symbols
		//https://codepen.io/etpinard/pen/WOxxaO

		var symbols = ["square", "diamond", "circle"];
		var colors = ["blue", "red", "green"]
		var names = ["T1", "T2", "T3"];

		var data = [];

		for (let i=0; i<plotPoints.length-1; i++){
			var trace = {
				x: plotPoints[0],
				y: plotPoints[i+1],
				mode: 'lines+markers',
				name:names[i],
				marker: {
					symbol: symbols[i],
					color: colors[i],
					maxdisplayed: 20,
					size: 10
				}
			};
			data.push(trace);
		};

		console.log('plot data', data);

		var d3 = Plotly.d3;
		var img_jpg= d3.select('#jpg-export');

		Plotly.newPlot('plot', data, layout)
		// .then(
    // function(gd)
    //  {
    //   Plotly.toImage(gd,{height:720,width:1280})
    //      .then(
    //         function(url)
    //      {
    //          img_jpg.attr("src", url);
    //          return Plotly.toImage(gd,{format:'jpeg',height:720,width:1280});
    //      }
    //      )
    // });

		var saveName = layout['yaxis']['title'] + " - " + layout['xaxis']['title']

		function plotSave (){
				Plotly.downloadImage(plot, {
					format: 'png',
					width: 1920,
					height: 1080,
					filename: saveName
				});

				// Plotly.toImage(plot, {
				// 	format: 'png',
				// 	width: 1920,
				// 	height: 1080,
				// 	// filename: saveName
				// }).then(
		    //         function(url)
		    //      {
		    //          img_jpg.attr("src", url);
		    //          return Plotly.toImage(plot,{format:'png',height:720,width:1280});
		    //      }
		    //      );
			};

		function downloadData() {
			document.getElementById("plotData").innerHTML = "<table><tr><td>"+ "time"+ "</td> <td>"+ "t1" + "</td><td>"+ "t2"+ "</td><td>"+ "t3" + "</td></tr> </table>";

			var x = plotPoints[0];
			var y1 = plotPoints[1];
			var y2 = plotPoints[2];
			var y3 = plotPoints[3];

			for (let i=0; i<y1.length; i++){
				document.getElementById("plotData").innerHTML += "<table><tr><td>"+x[i] + "</td><td>" + y1[i] + "</td><td> " + y2[i] + "</td><td> " + y3[i] + "</td></tr></table>";
			};

	      var a = document.body.appendChild(
           document.createElement("a")
        );
       a.download = saveName + ".html";
       a.href = "data:text/html," + document.getElementById("plotData").innerHTML;
       a.click(); //Trigger a click on the element
		};

		if ( document.getElementById("tik") != null){
			var savePlot = document.getElementById("tik");
			savePlot.addEventListener("click",function(e){ plotSave(); },false);

			var saveData= document.getElementById("saveData");
			saveData.addEventListener("click",function(e){ downloadData(); },false);
		};


	 };


};

if (document.getElementById('expDataLoad') == null){
ciz();
}

/// temperatures
function getData() {
    $.getJSON("data.json", function (data) {
      $('#a').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#b').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#c').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      // var autoRef = document.getElementById("onoff").value;

        $.each(data, function (i, item) {
          document.getElementById('a').innerHTML = data["T1"];
          document.getElementById('b').innerHTML = data["T2"];
          document.getElementById('c').innerHTML = data["T3"];

        });

					if (document.getElementById('expDataLoad') == null){
						if (expStatus  == 'START') {
							setTimeout(getData, 5000);
							setTimeout(ciz, 5000);
						}

					}



        // if (autoRef == "On") {
        // 	  setTimeout(getData, 5000);
        //     setTimeout(ciz, 5000);
        // }



    });

 };

 if (document.getElementById('expDataLoad') == null){
getData(); // run once to start it
}
// setInterval(ciz, 5000);
// var autoRef2 = document.getElementById("onoff").value;
// if (autoRef2 == "On") {
// 		setInterval(ciz, 5000);
// 	};
}

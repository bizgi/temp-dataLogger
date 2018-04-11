document.addEventListener('DOMContentLoaded', lo);

function lo(){



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
			$("#expDataLoad2").append(opts);
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

	// plot selected data
	function plotSelected() {
 	    let value =  $('#expDataLoad').val();
			let value2 =  $('#expDataLoad2').val();
	    document.getElementById('display').innerHTML = value;
			csv = "./expData/" + value + "/data.csv"
			csv2 = "./expData/" + value2 + "/data.csv"

			let plotDatas = [];
			let plotx = {};
			let ploty = {};

 			let points = processData(csv)
			let points2 = processData(csv2)

			let x = Object.keys(points[0]);
			let y = Object.keys(points[1]);

			console.log(points2);

 			for (let i=0; i<x.length; i++){
				if (document.getElementById(x[i]).checked == true){
					plotx[x[i]] = points[0][x[i]];
 				};
				if (document.getElementById('-'+x[i]).checked == true){
 					plotx['-'+x[i]] = points2[0][x[i]];
				};
			};
			plotDatas.push(plotx)

			for (let i=0; i<y.length; i++){
				if (document.getElementById(y[i]).checked == true){
					ploty[y[i]] = points[1][y[i]];
				};
				if (document.getElementById('-'+y[i]).checked == true){
					ploty['-'+y[i]] = points2[1][y[i]];
				}
			};
			plotDatas.push(ploty)



			console.log('pppp',plotDatas);
			makePlotly(plotDatas);
	};

 	// show saved experiment data
	function showPlotValues() {
		document.getElementById('plotValues').innerHTML = "";

		let value =  $('#expDataLoad').val();
		csv = "./expData/" + value + "/data.csv"
		let points = processData()
		let x = Object.keys(points[0]);
		let y = Object.keys(points[1]);

		// console.log(points);
		for (let i=0; i<x.length; i++){
			document.getElementById('plotValues').innerHTML += "<input type='checkbox' id='" + x[i] + "'> " + x[i] + "</input><br>"
		};

		document.getElementById('plotValues').innerHTML += "<br>"

		for (let i=0; i<y.length; i++){
			document.getElementById('plotValues').innerHTML += "<input type='checkbox' id='" + y[i] + "'> " +  y[i] + "</input><br>"
		}

	};

	// show saved experiment data
	function showPlotValues2() {
		document.getElementById('plotValues2').innerHTML = "";

		let value =  $('#expDataLoad2').val();
		csv = "./expData/" + value + "/data.csv"
		let points = processData()
		let x = Object.keys(points[0]);
		let y = Object.keys(points[1]);

		// console.log(points);
		for (let i=0; i<x.length; i++){
			document.getElementById('plotValues2').innerHTML += "<input type='checkbox' id='-" + x[i] + "'> -" + x[i] + "</input><br>"
		};

		document.getElementById('plotValues2').innerHTML += "<br>"

		for (let i=0; i<y.length; i++){
			document.getElementById('plotValues2').innerHTML += "<input type='checkbox' id='-" + y[i] + "'> -" +  y[i] + "</input><br>"
		}

	};

if (document.getElementById('selectBtn') != null){
	document.getElementById('expDataLoad').addEventListener('change', showPlotValues);
	document.getElementById('expDataLoad2').addEventListener('change', showPlotValues2);

 	document.getElementById('selectBtn').addEventListener('click', plotSelected);


};

// console.log(csv);
// var csv = "./data.csv";


// function ciz(){

	// var plotPoints = processData()


	function processData(csv) {
		var rawCsv;
		$.ajax({
				type: 'GET',
				url: csv,
				dataType: 'text',
				async: false,
				success:   function (data){
					rawCsv = data
					// console.log( data);
					}
		});

		var rawLines = rawCsv.split('\r\n');
		var csvHead = rawLines[0].split(',');

		var csvDatas = [];
		for (var k=1; k<rawLines.length-1; k++){
			var dataLine = {};
			for (var j=0; j<csvHead.length; j++){
				dataLine[csvHead[j]] = rawLines[k].split(',')[j];
			};
			csvDatas.push(dataLine);
		};


		allRows = csvDatas;
	   // console.log(allRows);
			//console.log(allRows[0]["id"]);

		// get sensorNames
		var sensorNames = [];
		$.ajax({
		    type: 'GET',
		    url: './config.json',
		    dataType: 'json',
				async: false,
				success:   function (data){
						for (let i=0; i<Object.values(data).length; i++){
							sensorNames.push( Object.values(data)[i]) ;
						};
					}
		});


    var x = {},
				y = {}

		for (let i=0; i<sensorNames.length; i++){
			y[sensorNames[i]] = []
		};

		x['time'] = [];
		x['timeD'] = [];

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
			x['time'].push(timeStep);
			x['timeD'].push((timeStep/t_end).toFixed(2));
			timeStep = timeStep + Number(expTimeStep);

			// y-axis values
			for (let j=0; j<sensorNames.length; j++){
 				if (row["id"] == sensorNames[j]) {
					y[sensorNames[j]].push(row["temp"])
				}
			};

		};

		var plotPoints = [x, y];

		return plotPoints;

	};



	function richardson(){
		const g = 9.81;
		const beta = 0.000247;
		const H = 0.8;
		var V = 0.2;

		var ri = ((g * beta * H * (t_top - t_bottom)) / (V*V)).toFixed(6) ;
		//console.log(ri);
		return ri
	};



function makePlotly(plotPoints){
		//
		var layout = {
			//width: 800,
			height: 600,
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

				title: 't [dk]',
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

				title: 'T [<sup>o</sup>C]',
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


		// symbols
		//https://codepen.io/etpinard/pen/WOxxaO

		var symbols = ["square", "square-open", "diamond", "diamond-open", "circle", "circle-open"];
		var colors = ["blue", "red", "green"]

		var xName = Object.keys(plotPoints[0])
		var xPoints = plotPoints[0][xName[0]]
		var yPoints = Object.values(plotPoints[1]);
		var yNames = Object.keys(plotPoints[1])

		var data = [];

		for (let i=0; i<yPoints.length; i++){
			var trace = {
				x: xPoints,
				y: yPoints[i],
				mode: 'lines+markers',
				name: yNames[i],
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
			var dataNames ='';
			for (let j=0; j<yPoints.length; j++){
				 dataNames += "<td class='tborder'>" + yNames[j] + "</td>";
			};
			document.getElementById("plotData").innerHTML +=  "<table><tr><td class='tborder'> x </td>" + dataNames + "</tr></table>"

			var dataTableX = '';
			var dataTableY = '';

			for (let i=0; i<yPoints[0].length; i++){
				dataTableX += "<table><tr><td class='tborder'>" + xPoints[i] + "</td></tr></table>";
			};

			for (let j=0; j<yPoints.length; j++){
				dataTableY += "<td>"
				for (let i=0; i<yPoints[j].length; i++){
					dataTableY += "<table><tr><td class='tborder'>" + yPoints[j][i] + "</td></tr></table>";
				};
				dataTableY += "</td>"
			}

			document.getElementById("plotData").innerHTML += "<table><tr><td class='tborder'>" + dataTableX + "</td>" + dataTableY + "</tr></table>"

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


// };

if (document.getElementById('expDataLoad') == null){
	let plotPoints = processData(csv)
	makePlotly(plotPoints);
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
							function ref(){
								let plotPoints = processData(csv)
								makePlotly(plotPoints)
							}
							setTimeout(ref, 5000);
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

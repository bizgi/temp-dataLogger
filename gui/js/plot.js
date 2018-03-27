
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
				size: 34,
				color: 'black'
				}
	}
}

var csv = "./data.csv";

function ciz(){
	Plotly.d3.csv(csv, function(data){
		processData(data) } );

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
		var t_end = 120;
		var timeStep = 0;

	  for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
			//	var formatedTime = new Date(Number(row["time"]));
			//console.log(time);
			//	var time =  Number(row["time"]);
			//x.push(time);

			// x axis values - 5 min
			x.push(timeStep);
			timeStep = timeStep + 5;

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

		console.log(x);
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
		console.log(ric);

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

		console.log(data);

		Plotly.newPlot('plot', data, layout)

		var saveName = layout['yaxis']['title'] + " - " + layout['xaxis']['title']

		function plotSave (data, layout, saveName){
				Plotly.newPlot('plot', data, layout)
					 .then(function(gd) {
								Plotly.downloadImage(gd, {
									format: 'png',
									height: 1080,
									width: 1920,
									filename: saveName
								})
							});
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

		var savePlot = document.getElementById("tik");
		savePlot.addEventListener("click",function(e){ plotSave(data, layout, saveName); },false);

		var saveData= document.getElementById("saveData");
		saveData.addEventListener("click",function(e){ downloadData(); },false);
	 };

};

ciz();

// setInterval(ciz, 5000);
// var autoRef2 = document.getElementById("onoff").value;
// if (autoRef2 == "On") {
// 		setInterval(ciz, 5000);
// 	};

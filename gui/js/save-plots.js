

function savePlot(){

	var mrk = "./data.csv"

	Plotly.d3.csv(mrk, function(data){ processData(data) } );


	function processData(allRows) {

	   // console.log(allRows);
			//console.log(allRows[0]["id"]);

	    var t1_y = [],
			 		t2_y = [],
					t3_y = [],
	 				x = [];

			var t_end = Number(allRows[allRows.length-1]["time"]);
			//console.log(t_end);

 	    for (var i=0; i<allRows.length; i++) {
	        row = allRows[i];
				//	var formatedTime = new Date(Number(row["time"]));

					var time =  Number(row["time"]) / t_end;

					//console.log(time);

					x.push(time);

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


	   // console.log('T1', t1_y);
		//	console.log('T2', t2_y);


		makePlotly( x, t1_y, t2_y, t3_y);

	};

	function makePlotly(x, t1_y, t2_y, t3_y ){
		// symbols
		//https://codepen.io/etpinard/pen/WOxxaO

		var trace1 = {
			x: x,
			y: t1_y,
			mode: 'lines+markers',
 			name:'T1',
			marker: {
					symbol: "square",
		      color: 'blue',
					maxdisplayed: 20,
					size: 10
						}
			};

		var trace2 = {
	    x: x,
			y: t2_y,
			mode: 'lines+markers',
			name: 'T2',
			marker: {
					symbol: "diamond",
					color: 'red',
					maxdisplayed: 20,
					size: 10
						}
		};

		var trace3 = {
			x: x,
			y: t3_y,
			mode: 'lines+markers',
			name: 'T3',
			marker: {
					symbol: "circle",
					color: 'green',
					maxdisplayed: 20,
					size: 10
						}
		};

		var layout = {
			//width: 1920,
			//height: 1080,
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
		    		}
  				},


  				yaxis: {
						showgrid: true,
						zeroline: true,
						showline: true,
						ticks: 'inside',
						mirror: 'ticks',
						tick0: 0,

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


	var data = [ trace1, trace2, trace3];

	plotSave(data, layout);

	};

	function plotSave (data, layout){
			Plotly.newPlot('plot', data, layout)
				 .then(function(gd) {
							Plotly.downloadImage(gd, {
								format: 'png',
								height: 1080,
								width: 1920,
								filename: 'newplot'
							})
						});

		}


};
//ciz();
//setInterval(ciz, 5000);



function ciz(){

	var mrk = "./data.csv"
	Plotly.d3.csv(mrk, function(data){ processData(data) } );

	function processData(allRows) {

	    console.log(allRows);
			//console.log(allRows[0]["id"]);

	    var t1_y = [],
			 		t2_y = [],
					t3_y = [],
	 				x = [];

	    for (var i=0; i<allRows.length; i++) {
	        row = allRows[i];
					var formatedTime = new Date(Number(row["time"]));
					//console.log(formatedTime);

					x.push(formatedTime);

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


	    console.log('T1', t1_y);
			console.log('T2', t2_y);


		makePlotly( x, t1_y, t2_y, t3_y);

	};

	function makePlotly(x, t1_y, t2_y, t3_y ){

		var trace1 = {
			x: x,
			y: t1_y,
			mode: 'lines',
			name:'T1'
			};

		var trace2 = {
	    x: x,
			y: t2_y,
			mode: 'lines',
			name: 'T2'
		};

		var trace3 = {
			x: x,
			y: t3_y,
			mode: 'lines',
			name: 'T3'
		};

	var data = [ trace1, trace2, trace3];
	    Plotly.newPlot('plot', data);
	};
};

ciz();
setInterval(ciz, 5000);

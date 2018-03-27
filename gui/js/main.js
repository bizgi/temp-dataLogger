
function getData() {
    $.getJSON("data.json", function (data) {
      $('#a').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#b').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#c').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      var autoRef = document.getElementById("onoff").value;

        $.each(data, function (i, item) {
          document.getElementById('a').innerHTML = data["T1"];
          document.getElementById('b').innerHTML = data["T2"];
          document.getElementById('c').innerHTML = data["T3"];

        });

        // if (autoRef == "On") {
        // 	  setTimeout(getData, 5000);
        //     setTimeout(ciz, 5000);
        // }
    });

 };
getData(); // run once to start it

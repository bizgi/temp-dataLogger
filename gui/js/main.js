function getData() {
    $.getJSON("data.json", function (data) {
      $('#a').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#b').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');
      $('#c').animate({color: '#FF0000'}, 'slow').animate({color: '#fff'}, 'slow');

        $.each(data, function (i, item) {
          document.getElementById('a').innerHTML = data["T1"];
          document.getElementById('b').innerHTML = data["T2"];
          document.getElementById('c').innerHTML = data["T3"];

        });
        setTimeout(getData, 5000);

    });
};
getData(); // run once to start it

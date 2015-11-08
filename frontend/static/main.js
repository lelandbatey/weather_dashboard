requirejs.config({
    baseUrl: 'static/',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery',
        d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
        moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min',
        moment_tz: '//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min'
    },
    map: {
        'views/TrafficView': {
            'View': 'View'
        }
    }
});

require([
    'jquery',
    'underscore',
    'moment',
    'moment_tz',
    'CardinalDirections',
    'View',
    'd3'
],
function($, _, moment, moment_tz, card_dir, View, d3){
"use strict";



var spec = {
    "temperature": [
        "Current temperature",
        function(number){return number.toFixed(1)+" °F";}
    ],
    "temp_delta_hour": [
        "Temperature change in last hour",
        function(number){return number.toFixed(1)+" °F";}
    ],
    "relative_humidity": [
        "Relative humidity",
        function(number) {return number.toFixed(1)+"%";}
    ],
    "wind_speed": [
        "Wind speed (miles/hour)",
        function(number) {return number.toFixed(1); }
    ],
    "wind_direction": [
        function(deg) {return "Wind direction ("+card_dir.degToDirection(deg).direction+" "+deg.toFixed(1)+")";},
        function(deg) {return card_dir.degToDirection(deg).arrow;}
    ],
    "time": [
        function(utc) {return "Time last updated ("+moment.tz(utc*1000, "US/Pacific").format("DD/MM/YY")+')';},
        function(utc) {return moment.tz(utc*1000, "US/Pacific").format("HH:mm"); }
    ]
};

$.get('api/weather', function(data){
    var views = View.refine(data, spec);
    View.insertViews(views);
    //console.log(data);
});


function fabViews(data){
    var t_views = [];


    for (var key in data){
        if (data.hasOwnProperty(key)){
            var traff = new View.TrafficView();
            t_views.push(traff.get_views(key, data[key]));
        }
    }
    var elements = t_views;

    var column_count = 0;
    var columns = $('.column');
    for (var i = 0; i < elements.length; i++){
        var view = elements[i];
        //console.log("View:", view);
        $(columns[column_count]).append(view);
        column_count = (column_count+1) % columns.length;
    }
}

$.get('api/traffic', function(data){
    fabViews(data);
    //console.log(data);
});


var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//console.log('Height:', h);
//console.log('Width :', w);
//$.get('api/h/'+h+'/w/'+w);


});


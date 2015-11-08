requirejs.config({
    baseUrl: 'static/',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery',
        d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
        moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min',
        moment_tz: '//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min'
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
    console.log(data);
});

var traffic_spec = {
    "nacr.us, eth0": [
        function(data){console.log(data);return "nacr.us, eth0 ("+data.unit+")";},
        function(rawdata){
            var data = rawdata['data'];
            var label = "nacr.us, eth0 ("+rawdata['unit']+")";
            return function(){

                var entry_div = $('<div>').addClass('entry');
                var result_div = $("<div>").addClass("result");
                var label_div = $("<div>").addClass("label");


                // Define D3 stuff
                var margin = {top: 0, right: 2, bottom: 30, left: 20},
                    width =  200 - margin.left - margin.right,
                    height = 120 - margin.top - margin.bottom;

                var xScale = d3.time.scale()
                    .range([0, width]);
                var yScale = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                var traffic_line = d3.svg.line()
                    .x(function(d){ return xScale(new Date(d.timestamp*1000))})
                    .y(function(d){ return yScale(d.rate);});

                var svg = d3.select(result_div[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                xScale.domain(d3.extent(data, function(d) { return new Date(d.timestamp*1000); }));
                yScale.domain(d3.extent(data, function(d) { return d.rate; }));

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    // Rotate x-axis text labels to make more readable
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)" );
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .style("stroke", "blue")
                    .attr("d", traffic_line);


                entry_div.append(result_div, label_div);
                label_div.text(label);
                return entry_div;
            }
        }
    ]
};


$.get('api/traffic', function(data){
    var views = View.refine(data, traffic_spec);
    View.insertViews(views);
    console.log(data);
});


var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
console.log('Height:', h);
console.log('Width :', w);
//$.get('api/h/'+h+'/w/'+w);


});


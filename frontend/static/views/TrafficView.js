define(['views/StdView', 'd3'], function(StdView, d3){
"use strict";

function TrafficView(){
   StdView.call(this);
}

TrafficView.prototype = Object.create(StdView.prototype);

TrafficView.prototype.generate_views = function (){
    this.label = "nacr.us, eth0 ("+this.data['unit']+")";
    var data = this.data['data'];

    // Define D3 stuff
    var margin = {top: 0, right: 2, bottom: 30, left: 20},
        width =  240 - margin.left - margin.right,
        height = 80 - margin.top - margin.bottom;

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

    console.log(this.result_div);
    var svg = d3.select(this.result_div[0]).append("svg")
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
        .attr("dx", "-1.8em")
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

    svg.select("g.x.axis")
        .call(xAxis.tickSize(3));


    this.label_div.text(this.label);
    return this.entry_div;
}


return TrafficView;

});

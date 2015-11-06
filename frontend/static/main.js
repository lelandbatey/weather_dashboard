requirejs.config({
    baseUrl: 'static',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
        moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min',
        moment_tz: '//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min'
    }
});

require(['jquery', 'underscore', 'moment', 'moment_tz', 'CardinalDirections'], function($, _, moment, moment_tz, direction){
"use strict";

function isFunction(f){
    return typeof f === "function";
}

function conductFormatting(data, spec){
    var results = [];
    for (var key in spec){
        if (spec.hasOwnProperty(key)){
            var tmp = spec[key];
            var label_str = tmp[0];
            var formatter = tmp[1];
            var rawdata = data[key];

            var result = {};

            if (isFunction(label_str)){
                result.label = label_str(rawdata);
            } else{
                result.label = label_str;
            }
            result.contents = formatter(rawdata);
            results.push(result);
        }
    }
    return results;
}

function makeViews(formatted_results){
    var views = [];
    for (var i = 0; i < formatted_results.length; i++){
        var result = formatted_results[i];
        var entry_div = $("<div>").addClass("entry");
        var result_div = $("<div>").addClass("result");
        var label_div = $("<div>").addClass("label");
        entry_div.append(result_div, label_div);

        result_div.text(result.contents);
        label_div.text(result.label);
        views.push(entry_div);
    }
    var column_count = 0;
    var columns = $('.column');
    for (var i = 0; i < views.length; i++){
        var view = views[i];
        $(columns[column_count]).append(view);
        column_count = (column_count+1) % columns.length;
    }
}

var spec = {
    "temperature": ["Current temperature", number => number.toFixed(1)+" °F"],
    "temp_delta_hour": ["Temperature change in last hour", number => number.toFixed(1)+" °F"],
    "relative_humidity": ["Relative humidity", number => number.toFixed(1)+"%"],
    "wind_speed": ["Wind speed (miles/hour)", number => number.toFixed(1)],
    "wind_direction": [
        deg => "Wind direction ("+direction.degToDirection(deg).direction+" "+deg.toFixed(1)+")",
        deg => direction.degToDirection(deg).arrow
    ],
    "time": [
        utc => "Time last updated ("+moment.tz(utc*1000, "US/Pacific").format("DD/MM/YY")+')',
        utc => moment.tz(utc*1000, "US/Pacific").format("HH:mm")
    ]
};

$.get('api/weather', (data)=>{
    var formatted_results = conductFormatting(data, spec);
    makeViews(formatted_results);
    console.log(data);
});

});


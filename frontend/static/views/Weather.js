define([
    'jquery',
    'underscore',
    'views/StdView',
    'moment',
    'moment_tz',
    'CardinalDirections'
],
function($, _, StdView, moment, moment_tz, card_dir){
"use strict";

function Weather(){
    StdView.call(this, 'weather', 'richland', '');
}
Weather.prototype = Object.create(StdView.prototype);

Weather.prototype.create_dom_view = function(entry){
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
    if (!spec[entry.name]){
        return null;
    }
    var label_fmt = spec[entry.name][0];
    var result_fmt = spec[entry.name][1];

    if (typeof label_fmt === 'function'){
        this.label_div.text(label_fmt(entry.contents));
    } else {
        this.label_div.text(label_fmt);
    }

    if (typeof result_fmt === 'function'){
        this.result_div.text(result_fmt(entry.contents));
    } else {
        this.result_div.text(result_fmt);
    }

    return this.entry_div;
}

return Weather;
});

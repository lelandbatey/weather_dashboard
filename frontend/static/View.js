define([
    'underscore',
    'views/Traffic',
    'views/Weather',
    'views/GpsWeather',
    'views/StdView',
], function(_, TrafficView, WeatherView, GpsWeather, StdView){
"use strict";

function construct_registry(rules){
    var reg = {"": null};
    function recursive_construct_reg(reg, accessors, contents){
        if (!accessors.length){
            reg[""] = contents;
            return;
        }
        var level = accessors.pop();
        if (!level){
            reg[''] = contents;
            return;
        } else if (!reg[level]) {
            reg[level] = {"": null};
        }
        recursive_construct_reg(reg[level], accessors, contents);
    };
    _.each(rules, function(rule){
        var accessors = rule.slice(0, 2).reverse();
        //console.log(reg, accessors, _.last(rule));
        recursive_construct_reg(reg, accessors, _.last(rule));
    });
    return reg;
}

function search_registry(registry, service_name, source_name, entry_name){
    function recursiveFindView(reg, accessors){
        if (!accessors.length){
            return reg[''];
        }
        var level = accessors.pop();
        if (!level){
            return reg[''];
        }
        if (!!reg[level]){
            return recursiveFindView(reg[level], accessors);
        } else {
            return reg[""];
        }
    }
    var accessors = [entry_name, source_name, service_name];
    return recursiveFindView(registry, accessors);
}




var rv = {};

rv.TrafficView = TrafficView;
rv.WeatherView = WeatherView;
rv.StdView = StdView;

var view_rules = [
    ['weather', 'richland', '', WeatherView],
    ['weather', 'leland_gps', '', GpsWeather],
    ['traffic', '', '', TrafficView]
];
rv.view_rules = view_rules;

var view_registry = construct_registry(view_rules);
rv.view_registry = view_registry;

rv.construct_registry = construct_registry;
rv.search_registry = search_registry;

function is_function(f){
    return typeof f === "function";
}

rv.render_entry = function(entry){
    var vClass = search_registry(rv.view_registry, entry.service, entry.source, entry.name);
    // Handles the case of a null view class
    if (!!vClass){
        var view = new vClass();
        return view.create_dom_view(entry);
    }
}


return rv;
});

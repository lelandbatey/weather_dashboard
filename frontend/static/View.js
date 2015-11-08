define(['views/EntryView', 'views/TrafficView', 'views/StdView'], function(EntryView, TrafficView, StdView){
"use strict";
var rv = {};

rv.EntryView = EntryView;
rv.TrafficView = TrafficView;
rv.StdView = StdView;

function isFunction(f){
    return typeof f === "function";
}

/**
 * Given an object containing data to be displayed and a "spec" object defining
 * transformations to make on the data, refines that data into Views. Returns
 * the Views.
 * 
 */
rv.refine = function (data, spec){
    var views = [];
    for (var key in spec){
        if (spec.hasOwnProperty(key)){
            var view_class;
            var tmp = spec[key];
            var label_str = tmp[0];
            var formatter = tmp[1];
            var rawdata = data[key];
            if (tmp.length > 2){
                view_class = tmp[2];
            } else {
                view_class = EntryView;
            }

            var ent_vw = new view_class();

            if (isFunction(label_str)){
                ent_vw.label = label_str(rawdata);
            } else{
                ent_vw.label = label_str;
            }
            ent_vw.contents = formatter(rawdata);
            //console.log(ent_vw.contents);
            views.push(ent_vw);
        }
    }
    return views;
}

/**
 * Given a list of refined View objects, insert those Views into the dom.
 *
 * @views An Array of one objects, either ViewObjects or
 *
 */
rv.insertViews = function (views){
    var elements = [];
    for (var i = 0; i < views.length; i++){
        var view = views[i];

        // If our view contents is a function, let the view create itself
        // however, then append output to elements.
        if (isFunction(view.contents)){
            elements.push(view.contents());
        } else {
            var entry_div = $("<div>").addClass("entry");
            var result_div = $("<div>").addClass("result");
            var label_div = $("<div>").addClass("label");
            entry_div.append(result_div, label_div);

            result_div.text(view.contents);
            label_div.text(view.label);
            elements.push(entry_div);
        }
    }
    var column_count = 0;
    var columns = $('.column');
    for (var i = 0; i < elements.length; i++){
        var view = elements[i];
        //console.log("View:", view);
        $(columns[column_count]).append(view);
        column_count = (column_count+1) % columns.length;
    }
}
return rv;
});

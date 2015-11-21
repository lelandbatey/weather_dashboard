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
    'View',
    'Model'
],
function($, _, View, Model){
"use strict";

function place_views(views){
    var column_count = 0;
    var columns = $('.column');
    for (var i = 0; i < views.length; i++){
        var view = views[i];
        $(columns[column_count]).append(view);
        column_count = (column_count+1) % columns.length;
    }
}


Model.gather(function(model){
    //console.log(model);
    //console.log(model.enumerateEntries());
    var views = [];
    _.each(model.enumerateEntries(), function(entry){
        var view = View.render_entry(entry);
        if (!!view){
            views.push(view);
        }
    });
    place_views(views);
});


});


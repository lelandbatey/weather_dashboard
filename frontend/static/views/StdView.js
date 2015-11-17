define(['View', 'jquery'], function(View, $){
"use strict";

function StdView(service, source, entry){
    this.service = service;
    this.source = source;
    this.entry = entry;
    this.contents = null;
    this.create_skeleton();
}


StdView.prototype.create_skeleton = function(){
    this.entry_div = $("<div>").addClass("entry");
    this.result_div = $("<div>").addClass("result");
    this.label_div = $("<div>").addClass("label");
    this.entry_div.append(this.result_div, this.label_div);
}

StdView.prototype.create_dom_view = null;

return StdView;
});

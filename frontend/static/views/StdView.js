define(['View', 'jquery'], function(View, $){
"use strict";

function StdView(){
    this.label = "";
    this.contents = "";
}

StdView.prototype.generate_views = null;

StdView.prototype.create_skeleton = function(){
    this.entry_div = $("<div>").addClass("entry");
    this.result_div = $("<div>").addClass("result");
    this.label_div = $("<div>").addClass("label");
    this.entry_div.append(this.result_div, this.label_div);
}

StdView.prototype.get_views = function(key, data){
    var rv = {};
    this.key = key;
    this.data = data;
    this.create_skeleton();
    if (!!this.label && !!this.contents){
        if(typeof this.label === "function"){
            rv.label = this.label(data);
        } else {
            rv.label = this.label;
        }
        rv.contents = this.contents;
        this.result_div.text(this.contents);
        this.label_div.text(this.label);
    } else {
        this.generate_views();
    }
    return this.entry_div;
}

return StdView;

});

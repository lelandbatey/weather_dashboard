define(['../View'], function(View){
"use strict";

function SpecView(){
    StdView.call(this);
}

SpecView.prototype = Object.create(StdView.prototype);

SpecView.prototype.generate_views = function (){
    this.result_div.text(this.contents);
    this.label_div.text(this.label);
}

function SpecView(label, contents){
   if (arguments.length < 2){
      this.label = "";
      this.contents = "";
   } else if (arguments.length === 1){
      throw "Cannot create EntryView with out 'label' and 'contents' arguments";
   } else {
      this.label = label;
      this.contents = contents;
   }
}

SpecView.prototype.create_views = function(key, data){
   var rv = {};
   if(typeof this.label === "function"){
      rv.label = this.label(data);
   } else {
      rv.label = this.label;
   }
   rv.contents = this.contents;
}

return SpecView;

});

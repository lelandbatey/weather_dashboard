define([], function(){
"use strict";

/**
 * Explicit module of EntryView, a "view" for an "entry" of data
 *
 * @option_obj An object that must have keys "label" and "contents"
 */
function EntryView(label, contents){
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


return EntryView;

});

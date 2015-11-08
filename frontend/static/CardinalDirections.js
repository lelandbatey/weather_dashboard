define("CardinalDirections", [], function(){
"use strict";

var to_return = {};

/**
 * Given a number representing a direction, return a
 */
function degToDirection(deg){
    var rv = {};
    if (deg >= 0 && deg <= 22.5){
        rv.arrow = "↑";
        rv.direction = "N";
    } else if (deg > 22.5 && deg <= 67.5){
        rv.arrow = "↗";
        rv.direction = "NE";
    } else if (deg > 67.5 && deg <= 112.5){
        rv.arrow = "→";
        rv.direction = "E";
    } else if (deg > 112.5 && deg <= 157.5){
        rv.arrow = "↘";
        rv.direction = "SE";
    } else if (deg > 157.5 && deg <= 202.5){
        rv.arrow = "↓";
        rv.direction = "S";
    } else if (deg > 202.5 && deg <= 247.5){
        rv.arrow = "↙";
        rv.direction = "SW";
    } else if (deg > 247.5 && deg <= 292.5){
        rv.arrow = "←";
        rv.direction = "W";
    } else if (deg > 292.5 && deg <= 337.5){
        rv.arrow = "↖";
        rv.direction = "NW";
    } else if (deg > 337.5 && deg <= 360.0){
        rv.arrow = "↑";
        rv.direction = "N";
    } else {
        rv.arrow = deg.toFixed(1);
        rv.direction = "?";
    }
    return rv;
}

to_return.degToDirection = degToDirection;

var test_degToDirection = function() {
   function assert(first, second){
       if (first === second){
           return true;
       };
       console.error("First does not equal second:", first, second);
   } 

   assert('N', degToDirection(0).direction);
   assert('NE', degToDirection(45).direction);
   assert('E', degToDirection(90).direction);
   assert('SE', degToDirection(135).direction);
   assert('S', degToDirection(180).direction);
   assert('SW', degToDirection(225).direction);
   assert('W', degToDirection(270).direction);
   assert('NW', degToDirection(315).direction);
   assert('N', degToDirection(360).direction);
}
test_degToDirection();


return to_return;

});

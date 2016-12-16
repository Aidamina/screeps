/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.distance');
 * mod.thing == 'a thing'; // true
 */

function pos(a){
 	if(a instanceof RoomPosition){
 		return a;
 	}else if( a instanceof RoomObject){
 		return a.pos;
 	}
}

function distanceSquared (a, b){
	return ((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) );

}

function distance (a, b){
	a = pos(a), b = pos(b);
	return Math.sqrt(distanceSquared(a,b));

}

Array.prototype.sortByDistanceTo = function(pos){
	return this.sort(function(a,b){return distance(pos, a)-distance(pos, b)});
}

distance.within = function(a, b, d){
	a = pos(a), b = pos(b);
	return distanceSquared(a, b) < d * d;
}

distance.sortClosestTo = function(target){
	var target = pos(target);
	return function(a, b){
		return distanceSquared(target, pos(a))-distanceSquared(target, pos(b));		
	}
}


module.exports = distance;
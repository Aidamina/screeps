/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.room');
 * mod.thing == 'a thing'; // true
 */

Memory.cache = Memory.cache || {};
function getFromCache(key){
	return Memory.cache[key];
}
function setToCache(key, value){
	Memory.cache[key]=value; 
}

Object.defineProperty(Room.prototype, 'sources', {
  get: function() { 
  	var key = this.name+"_sources";
  	var sources = getFromCache(key);
  	if(sources){
  		sources = sources.map(Game.getObjectById);
  	}else{
  		sources = this.find(FIND_SOURCES); 
  		setToCache(key, sources.map(function(e){return e.id}));
  	}
  	//console.log(sources.constructor==Array);
  	//console.log(sources.constructor);
  	return sources;
  	
  },
  configurable: false
});

module.exports = Room;
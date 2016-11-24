/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tasker');
 * mod.thing == 'a thing'; // true
 */

var FillTask = require('task.fill');

Object.defineProperty(Source.prototype, 'tasks', {
  get: function() { 
  	var key = room.name+"_sources";
  	var sources = getFromCache(key);
  	if(sources){
  		sources = sources.map(Game.getObjectById);
  	}else{
  		sources = this.find(FIND_SOURCES); 
  		setToCache(key, sources.map(function(e){return e.id}));
  	}
  	return sources;
  	
  },
  configurable: false
});


function handle(state){
	for(name in Game.rooms){
		room = Game.rooms[name];
		if(room.energyCapacityAvailable>0){//Do we have a spawn in this room
			//console.log(room.sources);
			for(var source of room.sources){

			}

			var targets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN )
                            // && structure.energy < structure.energyCapacity
                            ;                            
                    }
            });
            //return;
            //console.log(Object.keys(FillTask.prototype));
            //console.log(targets.length);
            for (target of targets){
            	var task = new FillTask(target, RESOURCE_ENERGY);
            	//console.log(target+": "+task.getProgress()+" "+task.isComplete());
            }
		}
	}
}


module.exports = handle
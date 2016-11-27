/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('turret');
 * mod.thing == 'a thing'; // true
 */

function healPartsInBody(creep){
	return creep.body.filter(function(part){
		return part.type == HEAL;
	}).length;

}

module.exports = {
	operate: function(state){
		for(var key in Game.rooms){
			var room = Game.rooms[key];
			var roomState = state.rooms[key];
			var towers = roomState.structures.filter(function(el){return (el instanceof StructureTower)});			
			var hostiles = roomState.hostiles;
			hostiles = hostiles.sort(function(a, b){ return healPartsInBody(b)-healPartsInBody(a); });
			if(hostiles.length) {
		        towers.forEach(tower => tower.attack(hostiles[0]));
		    }else{		    	
		    	for(var creep of roomState.my_creeps){
		    		if(creep.hits < creep.hitsMax){
		    			towers.forEach(tower => tower.heal(creep));
		    		}
		    	}
		    	for(var structure of roomState.structures){
		    		if(structure instanceof StructureWall){

		    		}else if(structure.hits < structure.hitsMax){
		    			if(structure instanceof StructureRampart){
		    				if(structure.hits > 100000){
		    					continue;
		    				}
		    			}
		    			towers.forEach(tower => { 
		    				if(tower.energy > tower.energyCapacity/2){
		    					tower.repair(structure)
		    				}
		    			});
		    		}
		    	}
		    }
		}
	}

};
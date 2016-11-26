/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
//Game.creeps.Skyler.memory = {role:'basic'}
//Game.spawns.Hub.createCreep([CARRY, CARRY, MOVE, MOVE, WORK], null, {role:'basic', room:'W5N3'});
var distance = require('utils.distance');

var roleBasic = {

    /** @param {Creep} creep **/
    run: function(state, creep) {
        var roomState = state.rooms[creep.room.name];
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {

            if(creep.room.controller.ticksToDowngrade < 3000) {
                creep.say("upgrading");
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                return;
            }

            var targets = roomState.structures.filter((structure) => {
                if(structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN){
                    return structure.energy < structure.energyCapacity;
                    }
                    return false;
                });
            if(!targets.length){
                    targets = roomState.structures.filter((structure) => {
                        if(structure.structureType == STRUCTURE_TOWER){
                            return structure.energy < structure.energyCapacity;
                        }
                        return false;
                    });
                }
            if(targets.length) {
                targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
                if(creep.transfer(targets[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }


            targets = roomState.structures.filter((structure) => {
                if (structure instanceof StructureWall || structure instanceof StructureRampart){
                    return structure.hits < 100000;
                }
                return structure.hits < structure.hitsMax *.8;
                
            });

            targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
            if(targets.length) {
                creep.say("repairing");
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                targets = roomState.structures.filter((structure) => {
                if(structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN){
                    return structure.energy < structure.energyCapacity;
                    }
                    return false;
                });
                if(!targets.length){
                    targets = roomState.structures.filter((structure) => {
                        if(structure.structureType == STRUCTURE_TOWER){
                            return structure.energy < structure.energyCapacity;
                        }
                        return false;
                    });
                }
                
                if(targets.length) {

                    targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
                    if(creep.transfer(targets[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    return;
                }
                targets = roomState.construction_sites;
                if(targets.length) {
                   
                    targets = targets.sort(function(a,b) { return  (a.progressTotal-a.progress)-(b.progressTotal-b.progress)});

                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    return;
                }
             
                if(!targets.length) {
                    creep.say("upgrading");
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                    return;
                }
               
            }
	    }
	    else {
	       if(!creep.memory.target){
                var targets = creep.room.sources.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
                creep.memory.target = targets[0].id;
            }

            var target = Game.getObjectById(creep.memory.target);
            var res = creep.harvest(target);
            if(res == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(target)==ERR_NO_PATH){
                    var targets = creep.room.sources.filter(function(source){return source.id!=creep.memory.target});
                    if(targets.length){
                        creep.memory.target = targets[0].id;
                    }
                }
            }else if (res == ERR_NOT_ENOUGH_RESOURCES){                
                var targets = creep.room.sources.filter(function(source){return source.id!=creep.memory.target&&source.energy>0});
                if(targets.length){
                    creep.memory.target = targets[0].id;
                }
            }
	    }
	}
};

module.exports = roleBasic;
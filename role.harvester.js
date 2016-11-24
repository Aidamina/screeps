/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var distance = require('utils.distance');


//Game.spawns.Hub.createCreep([CARRY, CARRY, MOVE, MOVE, WORK, WORK], null, {role: 'harvester'});
var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(state, creep) {
        var roomState = state.rooms[creep.room.name];
	    if(creep.carry.energy < creep.carryCapacity) {
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
        else {
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
            if(!targets.length){
                targets = roomState.structures.filter((structure) => {
                    if(structure.structureType == STRUCTURE_CONTAINER||structure.structureType == STRUCTURE_STORAGE){
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                    return false;
                });
            }

            targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                creep.moveTo(Game.spawns[Object.keys(Game.spawns)[0]]);
            }
        }
	}
};

module.exports = roleHarvester;
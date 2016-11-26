/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var distance = require('utils.distance');
//Game.spawns.Hub.createCreep([CARRY, MOVE, CARRY, MOVE, WORK, WORK, WORK], null, {role: 'upgrader'});
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(state, creep) {
        var roomState = state.rooms[creep.room.name];
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = roomState.structures.filter(function(el){return (el instanceof StructureStorage || el instanceof  StructureContainer) && el.store[RESOURCE_ENERGY]>0});
            sources.sort(distance.sortClosestTo(creep));
            if(!sources.length){
                var sources = roomState.structures.filter(function(el){return (el instanceof StructureStorage || el instanceof  StructureContainer)});
                if(!sources.length){
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
               
                return;
            }
            if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
	},
	energyCharge:1500
};

module.exports = roleUpgrader;
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
//Game.creeps.Skyler.memory = {role:'basic'}
//Game.spawns.Hub.createCreep([CARRY, MOVE, WORK], null, {role: 'claimer', target:'W5N3'});
var distance = require('utils.distance');

var roleBasic = {

    /** @param {Creep} creep **/
    run: function(state, creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
            targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
            if(targets.length) {
                creep.say("repairing");
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{                
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                //targets = targets.sort(function(a,b) { return (a.hits/a.hitsMax) - (b.hits/b.hitsMax)});
                targets = targets.sort(function(a,b) { return  (a.progressTotal-a.progress)-(b.progressTotal-b.progress)});
                
                if(targets.length) {
                    creep.say("building");
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);    
                    }
                }else{
                    creep.say("upgrading");
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
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
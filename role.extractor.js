/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var distance = require('utils.distance');
var _ = require('lodash');

//Game.spawns.Hub.createCreep([CARRY, CARRY, MOVE, MOVE, WORK, WORK], null, {role: 'extractor'});
var roleExtractor = {
    
    /** @param {Creep} creep **/
    run: function(state, creep) {
        var roomState = state.rooms[creep.room.name];

	    if(_.sum(creep.carry) < creep.carryCapacity) {
            if(!creep.memory.target){
                var targets = roomState.structures.filter(f=>f instanceof StructureExtractor);
                if(targets.length){
                    creep.memory.target = targets[0].id;
                }else {
                    console.log("no target found");
                    creep.say("no target found");
                }
            }

            var target = Game.getObjectById(creep.memory.target);
            var res = creep.harvest(target);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }


        }
        else {
           
            var targets = roomState.structures.filter((structure) => {
                if(structure.structureType == STRUCTURE_STORAGE){
                    return _.sum(structure.store) < structure.storeCapacity;
                }
                return false;
            });
            

            targets = targets.sort(distance.sortClosestTo(creep));

            if(targets.length > 0) {
                 for (key in creep.carry){
                    if(creep.carry[key]>0){
                        if(creep.transfer(targets[0], key) == ERR_NOT_IN_RANGE){
                            creep.moveTo(targets[0]);
                        }
                    }
                 }
            }else{
                creep.moveTo(Game.spawns[Object.keys(Game.spawns)[0]]);
            }
        }
	}
};

module.exports = roleExtractor;
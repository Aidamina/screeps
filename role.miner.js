/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
 //Game.spawns.Hub.createCreep([CARRY, MOVE, WORK, WORK, WORK, WORK, WORK], null, {role: 'miner', target:'71ac0772347ffe6'});
 var _ = require('lodash');
 var distance = require('utils.distance');

var roleMiner = {
    states:{
        default:function(creep){
            creep.memory.state = "charging";
        },
        charging:function(creep){
            creep.say("charging");
            creep.memory.state = "mining";
        },
        mining:function(creep){
            creep.say("mining");
            var total = _.sum(creep.carry);
            if(total>0){
                slaves = creep.memory.slaves || [];
                slaves = slaves.map(Game.getObjectById);
                for(slave of slaves){
                    if(distance(creep, slave)<2){
                        //console.log("transfering");
                        for (resourceType in creep.carry){
                            creep.transfer(slave, resourceType);    
                        }                        
                    }
                }
                //creep.transfer()
            }
            if(!creep.memory.target){
                creep.say("no target");
                return
            }
            target = Game.getObjectById(creep.memory.target);
            res = creep.harvest(target)
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }else if(res == ERR_NOT_ENOUGH_RESOURCES){
                var targets = creep.room.sources.filter(function(source){return source.id!=creep.memory.target&&source.energy>0});
                if(targets.length){
                    creep.memory.target = targets[0].id;
                }
            }
            
        }
        
    },

    /** @param {Creep} creep **/
    run: function(state, creep) {
        
        
        var state = creep.memory.state || "default";
        
        return roleMiner.states[state](creep);
        
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                creep.moveTo(Game.spawns[Object.keys(Game.spawns)[0]]);
            }
        }
	},
	energyCharge: 2500
};

module.exports = roleMiner;
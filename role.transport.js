/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
 //Game.spawns.Hub.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: 'transport', pickup:'fbff1e81f77d3af', delivery:'70d8f9a03352208'});
 //Game.spawns.Hub.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: 'transport', pickup:'fbff1e81f77d3af', delivery:'70d8f9a03352208'}); //refill ammo
var _ = require('lodash');
var distance = require('utils.distance');

var roleTransport = {
    
    states:{
        default:function(state, creep){
            creep.memory.state = "pickup";
        },
        pickup:function(state, creep){            
            if(!creep.memory.pickup){
                creep.say("no pickup");
                return;
            }
            var total = _.sum(creep.carry);
            if(total==creep.carryCapacity){
                 creep.memory.state = "delivery";
                 return roleTransport.states.delivery(state, creep);
                 
            }
            
            var resourceType = creep.memory.resource || RESOURCE_ENERGY;
            pickup = Game.getObjectById(creep.memory.pickup);
            if(pickup instanceof Creep){
                //console.log("Pickup is creep");
                if(distance(creep, pickup)>1){
                    //console.log("moving to creep");
                    creep.moveTo(pickup);    
                }
                state.rooms[creep.room.name].dropped.forEach(function(r){
                    if(distance(creep, r)<2){
                        creep.pickup(r);
                        creep.say("pickup");
                        console.log("picking up resources from the floor");
                    }
                })
                
            }else if (pickup instanceof Structure){
                if(creep.withdraw(pickup, resourceType)==ERR_NOT_IN_RANGE){
                    creep.moveTo(pickup);
                }
                
            }else if(!pickup){
                creep.say("pickup not found");

            }
            
        },
        delivery:function(state, creep){
            if(!creep.memory.delivery){
                creep.say("no delivery");
                return;
            }
            delivery = Game.getObjectById(creep.memory.delivery);
            for (resourceType in creep.carry){
                res = creep.transfer(delivery, resourceType)
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(delivery);
                    return;
                }else if (res == ERR_FULL){

                }else if(OK){
                    creep.say("delivery");
                }
            }   
            
            var total = _.sum(creep.carry);
            if(total==0){
                creep.memory.state = "pickup";
                return roleTransport.states.pickup(state, creep);
            }
            
        }
        
    },

    /** @param {Creep} creep **/
    run: function(state, creep) {
        
        
        var mode = creep.memory.state || "default";
        
        return roleTransport.states[mode](state, creep);
        
	},
	energyCharge: 2500
};

module.exports = roleTransport;
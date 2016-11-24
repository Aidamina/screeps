/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.keepalive');
 * mod.thing == 'a thing'; // true
 */
var roles = require('utils.roles');
var defaultCharge = 1500;
var keepalive = {
    handle : function(state, creep){
        var role = roles[creep.memory.role];
        var charge = (role?role.energyCharge:defaultCharge) || defaultCharge;
        var ticks = creep.ticksToLive;
        if(ticks < charge){
            result = Game.spawns['Hub'].renewCreep(creep);
            if(ticks < 500 && result==ERR_NOT_IN_RANGE){
                console.log("Creep "+creep.name+" needs renewal");
                creep.moveTo(Game.spawns['Hub']);
                creep.say('renewal');
                return false;
            }
            if(result==OK){
                /*
                if(!creep.memory.age){
                    creep.memory.age = 0;
                }*/
                creep.memory.age=(creep.ticksToLive-ticks)+creep.memory.age;
                console.log("Creep "+creep.name+" is renewed");
                return false;
            }
        }
        
        return true;
        
        
    }
    
}

module.exports = keepalive;
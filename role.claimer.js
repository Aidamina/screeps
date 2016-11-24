/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var distance = require('utils.distance');
//Game.spawns.Hub.createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'claimer', target:'W5N3'});
var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(state, creep) {
        var roomState = state.rooms[creep.room.name];
        var target = creep.memory.target;
        if(creep.room.name != creep.memory.target){
             creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(target)));
        }else{
            if(creep.claimController(creep.room.controller)!=OK){
                creep.moveTo(creep.room.controller);
            }
            
        }
	},
	energyCharge:1500
};

module.exports = roleClaimer;
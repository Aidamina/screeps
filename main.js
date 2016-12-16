var keepalive = require('util.keepalive');
var lifecycle = require('utils.lifecycle');
var state = require('utils.state');
var roles = require('utils.roles');
var distance = require('utils.distance');
var structures = require('utils.structure');
require('utils.creep');
var roads = require('utils.roads');
var tasker = require('tasker');
var turret = require('turret');
var defense = require('defense');


module.exports.loop = function () {
    Memory.ticks++;
    console.log(Memory.ticks);
    state.update();
    lifecycle.handle(state);

    tasker(state);
    turret.operate(state);

    roads();
    
    for(var id in state.rooms){
        var roomState = state.rooms[id];
        var inDefense = false;
        if(defense(roomState)){
            console.log("Room "+id+" in defense mode");
            inDefense = true;
        }
        for(var creep of roomState.my_creeps){
            if(creep.spawning){
                continue;
            }
            console.log(creep.full);
            if(creep.memory.room){
                var target = creep.memory.room;
                if(creep.room.name != target){
                     creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(target)));
                     continue;
                }
            }
            if(!keepalive.handle(roomState, creep)||inDefense){
                continue;
            }
            
            var role = roles[creep.memory.role];
            if(role){
                role.run(state, creep);
            }

        }


    }
}
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.state');
 * mod.thing == 'a thing'; // true
 */
var distance = require('utils.distance');
var roomImport = require('utils.room');


var state = {}
module.exports = {
    build: function(){
        state.rooms = {};
        for(var name in Game.rooms){
            var room = Game.rooms[name];
            var r = state.rooms[name]={};
            r.name = name;
            r.dropped = room.find(FIND_DROPPED_RESOURCES);
            r.hostiles = room.find(FIND_HOSTILE_CREEPS);
            r.structures = room.find(FIND_STRUCTURES);
            r.my_creeps = room.find(FIND_MY_CREEPS);
        }
        return state;
    }
};
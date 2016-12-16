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

var state = new State();

function RoomState(name){
	this.name = name;

}

RoomState.prototype.update = function(){
 	var room = Game.rooms[this.name];

	this.dropped = room.find(FIND_DROPPED_RESOURCES);
    this.hostiles = room.find(FIND_HOSTILE_CREEPS);
    this.structures = room.find(FIND_STRUCTURES);
    this.my_creeps = room.find(FIND_MY_CREEPS);
    this.construction_sites = room.find(FIND_CONSTRUCTION_SITES);


}

function State (){
	this.rooms = {};

    console.log("new state");
}

State.prototype.update = function(){
	this.rooms = {};
    for(var name in Game.rooms){       
        var roomState = this.rooms[name] = this.rooms[name] || new RoomState(name);
        roomState.update();
    }
    return state;


}


module.exports = state;
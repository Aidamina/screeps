/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.lifecycle');
 * mod.thing == 'a thing'; // true
 */
var defense = function(roomState){
    
    if(roomState.hostiles.length){
        for(var creep of roomState.my_creeps){
            creep.moveTo(Game.flags[roomState.name+"_Safety"]);
        }
        return true;
    }

    
    return false;

}


module.exports = defense;
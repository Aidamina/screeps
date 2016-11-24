/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.lifecycle');
 * mod.thing == 'a thing'; // true
 */


var lifecycle = {
    handle : function(state){
        
        lifecycle.build();
        //Game.spawns.Hub.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
        
    },
    
    build: function(state){
        var max = Game.spawns[Object.keys(Game.spawns)[0]].energyCapacity;
        var body = [MOVE,CARRY];
        var desired = [WORK, CARRY];
        var min = desired.reduce(function(prev, type){
            return Math.min(prev, lifecycle.costs[type]);
        }, 1000);
        var size = 0;
        for(type of desired){
            size=lifecycle.measure(body);
            while(size+lifecycle.costs[type]<=max){
                body.push(type);
                size=lifecycle.measure(body);
            }
                
        }
        
        //console.log(body);
        //console.log(size);
        
    },
    costs : {
        "move":50,
        "work":100,
        "carry":50,
    },
    measure: function(body){
        return body.reduce(function(prev, type){
            return prev + lifecycle.costs[type];
        },0);
    },
    
}

module.exports = lifecycle;
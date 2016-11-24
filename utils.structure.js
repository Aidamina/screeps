/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.structure');
 * mod.thing == 'a thing'; // true
 */

Memory.structures = Memory.structures || {};
Object.defineProperty(Structure.prototype, 'memory', {
  get: function() { 
  	return Memory.structures[this.id];
  },
  set: function (value) {
  	Memory.structures[this.id] = value;
  },
  configurable: false
});


module.exports = Structure;
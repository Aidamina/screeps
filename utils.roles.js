/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.roles');
 * mod.thing == 'a thing'; // true
 */
 
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTransport = require('role.transport');
var roleClaimer = require('role.claimer');
var roleBasic = require('role.basic');

module.exports = {
    'harvester': roleHarvester,
    'miner': roleMiner,
    'upgrader': roleUpgrader,
    'builder': roleBuilder,
    'transport': roleTransport,
    'claimer': roleClaimer,
    'basic': roleBasic
};


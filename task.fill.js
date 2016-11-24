/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.fill');
 * mod.thing == 'a thing'; // true
 */
var Task = require('task');


class FillTask extends Task {
	constructor(target, resourceType){
		if(!target instanceof StructureContainer || !target instanceof StructureExtension || !target instanceof StructureSpawn){ 
			throw new Error("Invalid type in FillTask");
		}
		if(target instanceof StructureExtension || target instanceof StructureSpawn){
			resourceType = RESOURCE_ENERGY;
		}

		var id = "fill_"+target.id;
		super(id);
		this.memory.resourceType = resourceType || RESOURCE_ENERGY;
		this.memory.target = target.id;
	}

	static load(memory){
		return new FillTask(Game.getObjectById(memory.target), memory.resourceType);
	}

	getProgress(){
		var target = this.getTarget();
		var resources = target.carry || target.store || target.energy;
		var capacity = target.carryCapacity || target.storeCapacity || target.energyCapacity;
		if(typeof resources == 'object'){
			resources = resources[this.getResourceType()];
		}
		return resources/capacity;
	}

	isComplete(){
		return this.getProgress()==1;
	}

	getResourceType(){
		return this.memory.resourceType;
	}

	getTarget(){
		return Game.getObjectById(this.memory.target);
	}

}

Task.registerTaskType(FillTask);
module.exports = FillTask;
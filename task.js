/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task');
 * mod.thing == 'a thing'; // true
 */

Memory.tasks = Memory.tasks || {};

function getOrCreateTaskMemory(id, type){
	var task = Memory.tasks[id];
	if(!task){
		task = {
			'type':type.name,
			'id': id,
			'memory':{}
		};
		Memory.tasks[id]=task;
	}
	return task.memory;
}

class Task {
	constructor(id){
		this.id = id;
		this.memory = getOrCreateTaskMemory(id, this.constructor);
	}

	static registerTaskType (type){
		Task.types =  Task.types ||{}
		Task.types[type.name]=type
	}

	getType(){
		return this.constructor.name;
	}

	static load(memory){
		throw new Error("load not implemented on "+this.getType());
	}

	getProgress(){
		throw new Error("getProgress not implemented on "+this.getType());
	}

}

module.exports = Task;
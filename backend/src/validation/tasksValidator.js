const validator = require("express-validator");
const isEmpty = require("is-empty");

module.exports = {
    tasksValidator(taskData){
        //
        let error = {};
        if(isEmpty(taskData.name)){
            error.name = "Task name is required.";
        }
        if(isEmpty(taskData.description)){
            error.description = "Task description is required.";
        }
        if(isEmpty(taskData.projectId)){
            error.projectId = "Provide the projectId housing your task.";
        }
        if(isEmpty(taskData.userId)){
            error.userId = "Provide the userId that created the task";
        }
        if(isEmpty(taskData.endTime)){
            error.endTime = "Provide the expected completion date"
        }
        if(taskData.status !== "new" && 
        taskData.status !=="in progress" &&
        taskData.status !== "closed" && 
        taskData.status !=="complete"){
            error.status = "Invalid task state.";
        }
        return {error, isValid: isEmpty(error)}
    },
    updateTasks(updateTaskData){
        let error = {}
        if(updateTaskData.status !== "new" && 
        updateTaskData.status !=="in progress" &&
        updateTaskData.status !== "closed" && 
        updateTaskData.status !=="complete"&&
        updateTaskData.status !== undefined){
            error.status = "Invalid task state.";
        }
        if(isEmpty(updateTaskData.taskId)){
            error.taskId = "Provide the Id of the task to update"
        }
        if(isEmpty(updateTaskData.projectId)){
            error.projectId = "Provide the project id housing this task."
        }
        if(isEmpty(updateTaskData.endTime)){
            error.endTime = "Provide the task expected completion date."
        }
        if (isEmpty(updateTaskData)){
            error.updateTaskData = "To update, populate atleast one field."
        }
        return {error, isValid: isEmpty(error)}
    }
}

const isEmpty = require("is-empty");
const validator = require("express-validator");
module.exports = {
    creationInfo(creationData){
        let error = {};
        if(isEmpty(creationData.name)){
            error.name = "Provide a department name.";
        }
        return {error, isValid: isEmpty(error)}; 
    },
    updateData(updateData){
        let error = {}
        if(isEmpty(updateData.userId)){
            error.userId = "Provide the logged in user."
        }
        return {error, isValid: isEmpty(error)};
    },
    linemanager(deptInfo){
        let error = {}
        if(isEmpty(deptInfo.userId)){
            error.userId = "Provide the userId to set as department manager"
        }
        if(isEmpty(deptInfo.departmentId)){
            error.departmentId = "Provide the departmentId to assign a manager"
        }
        return {error, isValid: isEmpty(error)};
    },
    deleteProject(deptInfo){
        let error = {}
        if(isEmpty(deptInfo.deptId)){
            error.deptId = "Project the department record to delete"
        }
        if(isEmpty(deptInfo.loggedUserId)){
            error.loggedUserId = "Provide the logged in user id"
        }
        return {error, isValid: isEmpty(error)}
    }
}
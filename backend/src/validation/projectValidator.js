const validator = require("express-validator");
const isEmpty = require("is-empty");

module.exports = {
    projectValidator(projectData){
        //
        let error = {};
        if(isEmpty(projectData.name)){
            error.name = "Project name is required.";
        }
        if(isEmpty(projectData.description)){
            error.description = "Project description is required.";
        }
        if(isEmpty(projectData.departmentId)){
            error.departmentId = "Project department is required.";
        }
        if(isEmpty(projectData.userId)){
            error.userId = "Provide the logged in user"
        }
        if(projectData.status !== "new" && 
        projectData.status !=="in progress" &&
        projectData.status !== "closed" && 
        projectData.status !=="complete"){
            error.status = "Invalid project state.";
        }
        return {error, isValid: isEmpty(error)}
    },
    updateProject(projectData){
        let error = {}
        if (isEmpty(projectData)){
            error.updateData = "To update, populate atleast one field."
        }
        if(isEmpty(projectData.projectId)){
            error.projectId = "Provide the projectId to update."
        }
        if(isEmpty(projectData.name)){
            error.name = "Provide the project name."
        }
        if(projectData.status!==undefined){
            if(projectData.status !== "new" && 
            projectData.status !=="in progress" &&
            projectData.status !== "closed" && 
            projectData.status !=="complete"){
                error.status = "Invalid project state.";
            }
        }
        return {error, isValid: isEmpty(error)}
    },
    deleteProject(projectInfo){
        let error = {}
        if(isEmpty(projectInfo.projectId)){
            error.projectId = "Provide the project record to delete"
        }
        if(isEmpty(projectInfo.loggedUserId)){
            error.loggedUserId = "Provide the signed in User"
        }
        return {error, isValid: isEmpty(error)}
    }
}

const validator = require("express-validator");
const isEmpty = require("is-empty");
//
module.exports = function validateTeamInput(requestBody){
    //
    //Create an object for reporting back error messages
    let error = {};
    if(isEmpty(requestBody.name)){
        error.name = "Provide a team name.";
    }
    if(isEmpty(requestBody.description)){
        error.description = "Provide a team description.";
    }
    if(isEmpty(requestBody.deliverable)){
        error.deliverable= "Provide a team target.";
    }
    return {error, isvalid: isEmpty(error)};    
}
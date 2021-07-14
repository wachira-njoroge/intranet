const validator = require("express-validator");
const isEmpty = require("is-empty");
const { reset } = require("nodemon");

module.exports = {
    login(loginData){
        let error = {};
        if(isEmpty(loginData.username)){
            error.username = "Username value not found.";
        }
        if(isEmpty(loginData.password)){
            error.password = "Password empty.";
        }
        return {error, isValid: isEmpty(error)}
    },
    registration(registrationInfo){
        //
        let error = {};
        if(isEmpty(registrationInfo.username)){
            error.username = "Username value not found.";
        }
        if(isEmpty(registrationInfo.firstName)){
            error.firstName = "Firstname not found. Insert a value.";
        }
        if(isEmpty(registrationInfo.lastName)){
            error.lastName = "Lastname empty. Feed in a value.";
        }
        if(isEmpty(registrationInfo.password)){
            error.password = "Password field empty.";
        }
        if(isEmpty(registrationInfo.contact)){
            error.contact = "Feed in a telephone number.";
        }
        if(isEmpty(registrationInfo.email)){
            error.email = "Kindly provide an email..for Official communication";
        }
        if(isEmpty(registrationInfo.departmentId)){
            error.departmentId = "Provide the department the User belongs to";
        }
        return {error, isValid: isEmpty(error)}
    },
    reset(resetInfo){
        let error = {};
        if(isEmpty(resetInfo.username)){
            error.username = "Username to update passord missing."
        }
        if(isEmpty(resetInfo.password)){
            error.password = "What`s the new password?"
        }
        if(isEmpty(resetInfo.contact)){
            error.contact = "Provide a contact to verify against"
        }
        return {error, isValid: isEmpty(error)}
    },
    update(updateValues){
        let error = {};
        if(isEmpty(updateValues)){
            error.values = "Provide the fields to update"
        }
        if(!isEmpty(updateValues.contact)){
            if(updateValues.contact.length < 12){
                error.contact = "Invalid contact length";
            }
        }
        return  {error: error, isValid: isEmpty(error)}
    },
    roleUpdate(userInfo){
        let error = {}
        if(isEmpty(userInfo.userId)){
            error.userId = "Provide the user record to update"
        }
        if(isEmpty(userInfo.roleName)){
            error.roleName = "Provide the user role to update to"
        }
        return {error, isValid: isEmpty(error)}
    },
    delete(userInfo){
        let error = {}
        if(isEmpty(userInfo.userId)){
            error.userId = "Provide the user Id to delete"
        }
        if(isEmpty(userInfo.loggedUserId)){
            error.loggedUserId = "Provide the logged in user id"
        }
        return{error, isValid: isEmpty(error)}
    }
}

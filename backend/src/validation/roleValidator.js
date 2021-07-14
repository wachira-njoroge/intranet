const validator = require("express-validator");
const isEmpty = require("is-empty");
module.exports = {
    roleCreate(roleInfo){
        let error = {};
        if(isEmpty(roleInfo.roleName)){
            error.roleName = "Provide the role name"
        }
        return {error, isValid: isEmpty(error)}
    },
    roleUpdate(details){
        let error = {}
        if(isEmpty(details.roleId)){
            error.roleId = "Provide the roleId to update"
        }
        return({error, isValid: isEmpty(error)})
    }
}
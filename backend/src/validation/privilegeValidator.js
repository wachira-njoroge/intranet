const isEmpty = require("is-empty")
module.exports = {
    addPrivilege(privilege){
        let error = {}
        if(isEmpty(privilege.permission_id)){
            error.permission_id = "Provide a permission id you would like to assign the privilege"
        }
        if(isEmpty(privilege.role_id)){
            error.role_id = "Provide a role id you would like to assign the privilege"
        }
        if(isEmpty(privilege.resource_id)){
            error.resource_id = "Provide a resource id you would like to assign the privilege"
        }
        return {error,isValid:isEmpty(error)}
    },
    updatePrivilege(privilege){
        let error = {}
        if(isEmpty(privilege.role_id)){
            error.role_id = "Provide the role Id to work with"
        }
        if (isEmpty(privilege.resource_id)){
            error.resource_id = "Provide the resource Id to work with"
        }
        if (isEmpty(privilege.privilege_id)){
            error.privilege_id = "Provide the privilege Id to work with"
        }
        if (isEmpty(privilege.permission_id)){
            error.permission_id = "Provide the permission Id to work with"
        }
        return {error, isValid:isEmpty(error)}
    }
}
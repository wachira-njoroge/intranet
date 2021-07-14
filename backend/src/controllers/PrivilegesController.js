//Import required models
const Privileges = require("../../models").Privileges
const Roles = require("../../models").Roles
const Resources = require("../../models").Resources
const Permissions = require("../../models").Permissions
//Import this controller's validator
const privilegesValidator = require("../validation/privilegeValidator")

module.exports = {
    createPrivilege(privilegeInfo,result){
        const{error,isValid}= privilegesValidator.addPrivilege(privilegeInfo)
        if(isValid){
            //Ensure role provided exists
            Roles.findByPk(privilegeInfo.role_id).then(role=>{
                if(role!==null){
                    //Check whether permission provided exists
                    Permissions.findByPk(privilegeInfo.permission_id).then(permission=>{
                        if(permission!==null){
                            //Check whether the resource provided exists
                            Resources.findByPk(privilegeInfo.resource_id).then(resource=>{
                                if(resource!==null){
                                    //Proceed to privilege creation
                                    Privileges.create({
                                        roleId: privilegeInfo.role_id,
                                        resourceId: privilegeInfo.resource_id,
                                        permissionId: privilegeInfo.permission_id
                                    }).then(privilege=>{
                                        result(null,{message: "Privilege added Successfully"})
                                    }).catch(error.message,null)
                                }else{
                                    result({error:"No resource found by the provided resource id"},null)
                                }
                            }).catch(error.message,null)
                        }else{
                            result({error:"No permission found by the provided permission id"},null)
                        }
                    }).catch(error=>result(error.message,null))
                }else{
                    result({error:"No Role found by that id"},null)
                }
            }).catch(error=>result(error.message,null))
        }else{
            result(error,null)
        }
    },
    findAll(result){
        Privileges.findAll({
        }).then(all=>{
            result(null,all)
        }).catch(error=>result(error,null))
    },
    updatePrivilege(privilegeInfo,result){
        const {error,isValid}= privilegesValidator.updatePrivilege(privilegeInfo)
        if(isValid){
            Privileges.findByPk(privilegeInfo.privilege_id).then(privilegefound=>{
                if(privilegefound!==null){
                    //proceed to update
                    
                }else{
                    result({error:"No privilege found by the provided Id"},null)
                }
            }).catch(error=>result(error,null))
        }else{
            result(error,null)
        }
    },
    deletePrivilege(privilege_id,result){
        Privileges.findByPk(privilege_id).then(privilege=>{
            if(privilege!==null){
                privilege.destroy().then(destroyed=>{
                    result(null,{message:"Privilege successfully deleted"})
                }).catch(error=>result(error,null))
            }else{
                result({error:"No privilege found by that id"},null)
            }
        }).catch(error=>result(error,null))
    },
   
}
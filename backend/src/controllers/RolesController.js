//Import required model
const Roles = require("../../models").Roles
const Privileges = require("../../models").Privileges
const Resources = require("../../models").Resources
const Permissions = require("../../models").Permissions
//Import validator
const validator = require("../validation/roleValidator")
module.exports = {
    createRole(roleInfo, result){
        const {error,isValid} = validator.roleCreate(roleInfo)
        if(isValid){
            //Ensure no role exists, with the given name
            Roles.findOne({
                where: {
                    role_name: roleInfo.roleName
                }
            }).then(roleFound=>{
                if(roleFound!==null){
                    result({error:"Role name already exists"},null)
                }else{
                    Roles.create({
                        role_name: roleInfo.roleName
                    }).then(role=>{
                        //
                        //Add a default previlege for the role created
                        Privileges.bulkCreate([
                            {
                                permissionId: 2,
                                resourceId: 1,
                                roleId: role.id
                            },
                            {
                                permissionId: 2,
                                resourceId: 4,
                                roleId: role.id
                            },
                            {
                                permissionId: 2,
                                resourceId: 5,
                                roleId: role.id
                            }]).then(privilege=>{
                        }).catch(err=>result({error: err},null))
                        result(null, {message: "Role has been created Successfully"})
                    })
                    
                    .catch(error=>result({error:error},null));
                }
            }).catch(error=>result(error,null))
        }else{
            result(error,null)
        }
    },
    deleteRole(roleId, result){
        Roles.findByPk(roleId).then(roleFound=>{
            if(roleFound!==null){
                roleFound.destroy().then(deleted=>result(null,{
                    message: "Role Deletion Successful"})).catch(err=>result(err.message,null))
            }else{
                result({error: "No Role exists by that Id"},null)
            }
        }).catch(error=>result(error.message,null))
    },
    getAllRoles(result){

        Roles.findAll({
            attributes: ['role_name']
        }).then(roles=>result(null,roles)).catch(err=>result(err,null))
    },
    updateRole(details,result){
        const {error,isValid} = validator.roleUpdate(details)
        if(isValid){
            //Ensure only admin can modify roles
            Roles.findByPk(details.roleId).then(roletoupdate=>{
                if(roletoupdate!==null){
                    roletoupdate.update({
                        role_name: details.roleName
                    }).then(roleupdated=>{
                        result(null, {Message: "Role updated Succesfully"})
                    }).catch(error=>result({error: error},null))
                }else{
                    result({error: "Invalid Role provided"},null)
                }
                
            }).catch(error=>result(error,null))
        }else{
            result({error: error},null)
        }
    }
}
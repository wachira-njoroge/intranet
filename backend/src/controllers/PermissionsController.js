const Permissions = require("../../models").Permissions

module.exports = {
    fetchAll(result){
        Permissions.findAll().then(permissions=>{
            result(null, permissions);
        }).catch(err=>{
            result(err, null);
        })
    },
    fetchOne(permissionId, result){
        Permissions.findOne({where:{
            id: permissionId}
        }
            ).then(permission=>{
                if(permission){
                    result(null, permission)
                }else{
                    result({error:"Permission does not exist"}, null);
                }
            }).catch(err=>{
                result(err, null);
            });
    },
    editPermission(permissionId, permissionData, result){
        Permissions.findOne({
            where:{
                id:permissionId
            }
        }).then(perm=>{
            if (perm){
                perm.update({
                    name: permissionData.name,
                    description: permissionData.description
                }).then(()=>{
                    result(null, {message: "update was successfull"})
                }).catch(err=>{result(err, null)});
            }else{
                result({error:"permission does not exist"}, null);
            }
        }).catch(err=>{
            result(err, null);
        })
    },
    createPermission(permissionData, result){
        Permissions.findOne({
            where: {
                name: permissionData.name
            }
        }).then(perm=>{
            if (perm){
                result({error:"permission exists"}, null);
            }else {
                Permissions.create({
                    name: permissionData.name,
                    description: permissionData.description
                }).then(()=>{
                    result(null, {message:"permissions created successfully"});
                }).catch(err=>{
                    result(err, null);
                })
            }
        }).catch(err=>{
            result(err, null);
        })
    },
    removePermission(permissionId, result){
        Permissions.findOne({
            where: {
                id: permissionId
            }
        }).then(perm=>{
            if (!perm){
                result({error:"permission does not exist"}, null);
            }else {
                perm.destroy().then(permission=>{
                    result( null, permission)
                }).catch(err=>{
                    result(err, null)
                })
            }
        })
    }
}
 
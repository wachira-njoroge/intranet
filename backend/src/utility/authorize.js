const Privileges = require("../../models").Privileges;
const Permissions = require("../../models").Permissions;

module.exports = {
    authorize(role, accessRight, resource, result){
        Privileges.findOne({
            where:{
                role: role,
                resource: resource
            }}).then((priv)=>{
                Permissions.findByPk(priv.permissionId).then(perm=>{
                    if(perm[accessRight]){
                        result(null, true);
                    }else{
                        result(null, false);
                    }
                }).catch(err=>{
                    result(err, null)
                })
            }).catch(err=>{
                result(err, null)
            })
    }
}

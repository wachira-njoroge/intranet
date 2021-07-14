const Resources = require("../../models").Resources;
const resourceValidator = require("../validation/resourceValidator")
module.exports = {
    createResource(resourceData, result){
        // name validator
        Resources.findOne(
            resourceData.name
            ).then(resource=>{
                if (resource !==null){
                    result({error: "Resource already exists"},null)
                }else{
                    Resources.create({
                        name: resourceData.name,
                        description: resourceData.description
                    }).then(resource=>{
                        result(null, {message: "Resource cerated successfully"});
                    }).catch(err=>{
                        result({error,err}, null);
                    })
                }
            }).catch(err=>{
                result(err, null)
            })
    },
    allResources(result){
        Resources.findAll({
            attributes:["name","description"]
        }).then(resources=>{
            result(null,resources)
        }).catch(err=>{
            result({error:err},null)
        })
    },
    updateResource(resourceInfo, result){
        const {error,isValid}= resourceValidator.updateResource(resourceInfo)
        if(isValid){
            //check user role...only admin or manager can update 
        }
    }
}

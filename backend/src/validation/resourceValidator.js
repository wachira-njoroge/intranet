const isEmpty = require("is-empty")
module.exports={
    updateResource(resourceInfo){
        let error = {}
        if(isEmpty(resourceInfo.resourceId)){
            error.resourceId = "Provide the resource to update"
        }
        return({error, isValid: isEmpty(error)})
    }
}
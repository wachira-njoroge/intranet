const express = require("express");
const router = express.Router();
//Import controller
const rolesController = require("../controllers/RolesController")
router.post("/create", (req,res)=>{
    rolesController.createRole(req.body, (error,role)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(role)
        }
    });
});
router.delete("/delete/:roleId", (req,res)=>{
    rolesController.deleteRole(req.params.roleId, (error,deleted)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(deleted)
        }
    });
})
router.get("/all", (req,res)=>{
    rolesController.getAllRoles((error,roles)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(roles)
        }
    })
})
router.patch("/update", (req,res)=>{
    rolesController.updateRole(req.body, (error,updated)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(updated)
        }
    })
})
module.exports = router
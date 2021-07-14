
const express = require("express");
const router = express.Router();
const PermissionController = require("../controllers/PermissionsController");

router.get("/all", (req, res)=>{
    PermissionController.fetchAll((err,message)=>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(message);
        }
    })
});

router.get("/permission/:id", (req, res)=>{
    PermissionController.fetchOne(req.params.id, (err,message)=>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(message);
        }
    })
});

router.patch("/edit-permission/:id",(req, res)=>{
    PermissionController.editPermission(req.params.id, req.body, (err,message)=>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(message);
        }
    })
});

router.post("/create", (req, res)=>{
    PermissionController.createPermission(req.body, (err, message)=>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(message);
        }
    })
});

router.delete("/remove/:id", (req, res)=>{
    PermissionController.removePermission(req.params.id, (err, message)=>{
        if(err){
            res.status(400).json(err);
        }
        else {
            res.status(200).json(message);
        }
    })
});
module.exports = router;
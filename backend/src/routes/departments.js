//Import departments from controllers module
const department = require("../controllers/departmentsController");
const express = require("express");
const departmentsController = require("../controllers/departmentsController");
//Create a route that points to departments
const router = express.Router();
//Create a new department
router.post("/create", (req, res)=>{
    department.createDepartment(req.body, (err, success)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.status(200).json(success);
        }
    });
});
//Fetch for all departments
router.get("/all", (req, res)=>{
    department.getAll((error, success)=>{
        if(error){
            res.status(400).json(error);
        }else{
            res.status(200).json(success);
        }
     });
});
//Get a specific department by its ID or name
router.get("/id/:departmentId", (req, res)=>{
    department.getById(req.params.departmentId, (error,found)=>{
        if(error){
            res.status(400).json(error);
        }else{
            res.status(200).json(found);
        }
    });
});
router.put("/update/:departmentId",(req,res)=>{
    department.updateInfo(req.params.departmentId, req.body, (err,success)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(success)
        }
    })
});
//Delete a departmentgiven its id
router.delete("/delete", (req, res)=>{
    department.delete(req.body, (error, success)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(success)
        }
    })
});
router.get("/members/:departmentId", (req,res)=>{
    departmentsController.getMembers(req.params.departmentId, (error,members)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(members)
        }
    });
});
router.patch("/manager", (req,res)=>{
    departmentsController.addManager(req.body, (error,manager)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(manager)
        }
    })
})
module.exports = router;
const express = require("express");
const router = express.Router();
const ResourceController = require("../controllers/ResourcesController");

router.post("/create", (req, res)=>{
    ResourceController.createResource(req.body, (err, message)=>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(message);
        }
    })
});
router.get("/all", (req,res)=>{
    ResourceController.allResources((error,resources)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(resources)
        }
    })
})
router.patch("/update",(req,res)=>{
    
})
module.exports = router;

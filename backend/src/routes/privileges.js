const express = require("express")
const router = express.Router();
const PrivilegesController = require("../controllers/PrivilegesController") 
//
router.post("/create", (req,res)=>{
    PrivilegesController.createPrivilege(req.body,(error,privilege)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(privilege)
        }
    })
})
router.get("/update",(req,res)=>{
    PrivilegesController.updatePrivilege(req.body,(error,updated)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(updated)
        }
    })
})
module.exports = router;
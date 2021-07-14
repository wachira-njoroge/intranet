//
//Create the teams route
//Import express for routing functionality.
const express = require("express");
//
const router = express.Router();
//
//Import the teamsController from controllers module
const TeamsController = require("../controllers").TeamsController;
//
//Expose the route and enforce the http method
router.post('/create', (req, res)=>{
    //
    //Get the post data from the incoming request.
    const incoming = req.body;
    TeamsController.createTeam(incoming, (error, team)=>{
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(team);
        }
    });
});
//
router.delete("/delete", (req, res)=>{
    //
    //Get the specific record from get params.
    //When a "?" is used in url params, use req.query otherwise when ":"is used in query
    //params, use req.params
    const target = req.query.id;
    //
    //Ensure the id value is an Integer
    const value = parseInt(target);
    TeamsController.deleteTeam(value, (error, deleted)=>{
        if (error) {
            //
            res.status(400).json(error.message);
        } else {
            res.status(200).json(deleted);
        }
    });
});
router.get('/all', (req, res)=>{
  
    const val = req.query.id;
    // res.send(val);
    const valInt = parseInt(val);
    TeamsController.findTeams((error, found) => {
        if (error) {
            res.status(400).json(error.message);
        } else {
            res.status(200).json(found);
        }
    });
});
router.post("/update", (req, res)=>{
    //
    //Get the post body from the request
    const info = req.body;
    TeamsController.updateTeamInfo(info, (error, success)=>{
        if (error) {
            res.status(400).json(error.message);
        } else {
            res.status(200).json(success);
        }
    });
});
module.exports = router;


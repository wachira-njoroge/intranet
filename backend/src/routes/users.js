const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");

router.get("/all", (req, res) => {
  UsersController.getUsers((err, users) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

router.get("/id/:userId", (req, res) => {
  UsersController.getUsersById(req.params.userId, (err, user) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

router.get("/teams/:teamId", (req, res) => {
  UsersController.getTeamMembersByTeam(req.params.teamId, (err, users) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

router.get("/department/:id", (req, res) => {
  UsersController.getDepartmentMembers(req.params.id, (err, users) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

router.post("/register", (req, res) => {
  UsersController.registerUser(req.body, (err, msg) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(msg);
    }
  });
});
router.patch("/updateRole", (req,res)=>{
  UsersController.updateRole(req.body, (err,msg)=>{
    if(err){
      res.status(400).json(err)
    }else{
      res.status(200).json(msg)
    }
  })
})
router.patch("/changeProfile/:userId", (req, res) => {
  UsersController.changeProfile(req.params.userId, req.body, (err, msg) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(msg);
    }
  });
});

router.patch("/reset", (req, res)=>{
  UsersController.resetPassword(req.body, (err, msg)=>{
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(msg)
    }
  })
})

router.post("/login", (req, res) => {
  UsersController.login(req.body, (err, user) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

router.delete("/removeUser", (req, res) => {
  //Confirm on token usage..if req.user object is created
  UsersController.removeUser(req.body, (err, user) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

module.exports = router;
 
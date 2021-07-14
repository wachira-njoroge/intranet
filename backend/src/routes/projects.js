const express = require("express");
const router = express.Router();
const ProjectsController = require("../controllers/ProjectsController");

router.get("/all", (req, res) => {
    ProjectsController.findAllProjects((err, tasks) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(tasks);
    }
  });
});

router.get("/departments/:departmentId", (req, res) => {
    ProjectsController.findDepartmentProjects(req.params.departmentId, (err, task) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(task);
    }
  });
});

router.get("/states/:state", (req, res) => {
    ProjectsController.findProjectByState(
    req.params.state,
    (err, tasks) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(tasks);
      }
    }
  );
});

router.post("/create", (req, res) => {
  // add unique name identifier
    ProjectsController.createProject(req.body, (err, project) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(project);
      }
    });
});

router.patch("/edit-project", (req, res) => {
     ProjectsController.updateProject(req.body, (err, message) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(message);
      }
    });
  });

router.delete("/delete", (req, res) => {
  ProjectsController.deleteProject(req.body, (err, tasks) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(tasks);
    }
  });
});

router.get("/tasks/:taskId", (req, res)=>{
  ProjectsController.findProjectTasks(req.params.id, (err,success)=>{
      if(err){
        res.status(400).json(err)
      }else{
        res.status(200).json(success)
      }
  });
});
router.get("/projectPartcipants/:projectId", (req,res)=>{
  ProjectsController.findProjectParticipants(req.params.projectId, (error,participants)=>{
    if(error){
      res.status(400).json(error)
    }else{
      res.status(200).json(participants)
    }
  });
});
module.exports = router;

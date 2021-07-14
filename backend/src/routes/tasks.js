const express = require("express");
const router = express.Router();
const TasksController = require("../controllers/TasksController");

router.get("/all", (req, res) => {
  TasksController.findAllTasks((err, tasks) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(tasks);
    }
  });
});

router.get("/specific/:id", (req, res) => {
  TasksController.findTask(req.params.id, (err, task) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(task);
    }
  });
});

router.get("/states/:state", (req, res) => {
  TasksController.findTasksWithState(
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
  TasksController.createTask(req.body, (err, tasks) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(tasks);
      }
    });
  });

router.put("/edit-task", (req, res) => {
    TasksController.updateTask(req.body, (err,tasks) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(tasks);
      }
    });
  });

router.delete("/delete/:taskId", (req, res) => {
  TasksController.deleteTask(req.params.taskId, (err, tasks) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(tasks);
    }
  });
});

router.get("/project/:id", (req,res)=>{
  TasksController.findTasksByProject(req.params.id, (err,success)=>{
      if(err){
        res.status(400).json(err)
      }else{
        res.status(200).json(success)
      }
  });
});
router.get("/user/:id", (req,res)=>{
  TasksController.findTasksByUser(req.params.id, (err,task)=>{
      if(err){
        res.status(400).json(err)
      }else{
        res.status(200).json(task)
      }
  });
});
router.get("/users/project/:id",(req,res)=>{
  TasksController.findProjectUsers(req.params.id, (error,users)=>{
    if(error){
      res.status(400).json(error)
    }else{
      res.status(200).json(users)
    }
  });
});
router.get("/user/:userId/:projectId", (req,res)=>{
  TasksController.findUserTasksByProject(req.params.userId,req.params.projectId, (error,tasks)=>{
      if(error){
        res.status(400).json(error)
      }else{
        res.status(200).json(tasks)
      }
  })
});

router.get("/department/:departmentId", (req, res)=>{
  TasksController.findDepartmentalTasks(req.params.departmentId, (err, tasks)=>{
    if(err){
      res.status(400).json(err)
    } else {
      res.status(200).json(tasks)
    }
  });
});

router.get("/progress/:projectId",(req,res)=>{
  TasksController.getProgress(req.params.projectId,(error,progress)=>{
    if(error){
      res.status(400).json(error)
    }else{
      res.status(200).json(progress)
    }
  });
});
module.exports = router;

const sequelize = require("sequelize");
const Tasks = require("../../models").Tasks;
const Users = require("../../models").Users;
const Projects = require("../../models").Projects;
const Departments = require("../../models").Departments;
const tasksValidator = require("../validation/tasksValidator");
const Op = sequelize.Op;

module.exports = {
  // create general task without hierachial order
  createTask(createTaskPayload, result) {
    const { isValid, error } = tasksValidator.tasksValidator(createTaskPayload);
    if (isValid) {
      Projects.findOne({
        where: {
          id: createTaskPayload.projectId,
        },
      })
        .then((project) => {
          if (project) {
            Users.findByPk(createTaskPayload.userId)
              .then((user) => {
                if (user !== undefined) {
                  Tasks.create({
                    name: createTaskPayload.name,
                    description: createTaskPayload.description,
                    status: createTaskPayload.status,
                    start_time: createTaskPayload.startTime,
                    end_time: createTaskPayload.endTime,
                    projectId: createTaskPayload.projectId,
                    userId: createTaskPayload.userId,
                  })
                    .then(() => {
                      //
                      //Check if the current project endtime, is greater than the
                      //newly created task endTime. If not, update the project endTime to that of the task.
                      const taskEndtime = new Date(createTaskPayload.endTime);
                      if (project.end_time < taskEndtime) {
                        project
                          .update({
                            end_time: taskEndtime,
                          })
                          .catch((err) => result({ error: err }, null));
                      }
                      result(null, { message: "Task Create Successful" });
                    })
                    .catch((err) => {
                      result(err.message, null);
                    });
                } else {
                  result({ error: "No user found by that Id" }, null);
                }
              })
              .catch((error) => {
                result(error.message, null);
              });
          } else {
            result({ error: "project not found" }, null);
          }
        })
        .catch((error) => {
          result(error.message, null);
        });
    } else {
      result({ error: error }, null);
    }
  },

  updateTask(updatePayload, result) {
    const { isValid, error } = tasksValidator.updateTasks(updatePayload);
    if (isValid) {
      //Check if task exists
      Tasks.findByPk(updatePayload.taskId)
        .then((task) => {
          if (task !== null) {
            //check if project id provided exists
            Projects.findByPk(updatePayload.projectId)
              .then((project) => {
                if (project !== null) {
                  task
                    .update({
                      name: updatePayload.name,
                      description: updatePayload.description,
                      status: updatePayload.status,
                      start_time: updatePayload.startTime,
                      end_time: updatePayload.endTime,
                      projectId: updatePayload.projectId,
                    })
                    .then((updated) => {
                      const taskEndtime = new Date(updatePayload.endTime);
                      if (project.end_time < taskEndtime) {
                        project
                          .update({
                            end_time: taskEndtime,
                          })
                          .catch((err) => result({ error: err }, null));
                      }
                      result(null, { message: "Task update Successful" });
                    })
                    .catch((err) => result({ error: err.message }, null));
                } else {
                  result({ error: "Invalid project." }, null);
                }
              })
              .catch((error) => result({ error: error }, null));
          } else {
            result({ error: error }, null);
          }
        })
        .catch((error) => result({ error: error }, null));
    } else {
      result({ error: error }, null);
    }
  },

  deleteTask(taskId, result) {
    Tasks.findByPk(taskId)
      .then((task) => {
        if (task !== null) {
          task
            .destroy()
            .then(() => {
              result(null, { message: "Task deleted successfully." });
            })
            .catch((err) => {
              result(err, null);
            });
        } else {
          result({ error: "Task By that Id not found" }, null);
        }
      })
      .catch((err) => {
        result(err, null);
      });
  },

  /**Reports:
   * the following methods should be able to achieve the following.
   * 1. Return all tasks in the states 'new', 'in progress', 'closed', 'complete'.
   * 2. Return all tasks belonging to an individual, department or team.
   * 3. Return a task's immediate child task.
   *
   */

  findTask(taskId, result) {
    Tasks.findOne({
      where: {
        id: taskId,
      },
    })
      .then((workItem) => {
        result(null, workItem);
      })
      .catch((err) => {
        result(err, null);
      });
  },

  findAllTasks(result) {
    Tasks.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "status",
        "start_time",
        "end_time",
      ],
      include: [
        {
          model: Projects,
          as: "project",
          attributes: ["id", "name"],
        },
        {
          model: Users,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    })
      .then((workItems) => {
        result(null, workItems);
      })
      .catch((err) => {
        result(err, null);
      });
  },

  findTasksWithState(state, result) {
    Tasks.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "status",
        "start_time",
        "end_time",
      ],
      where: {
        status: state,
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: Projects,
          as: "project",
          attributes: ["id", "name"],
        },
      ],
    })
      .then((workitems) => {
        result(null, workitems);
      })
      .catch((err) => {
        result(err, null);
      });
  },
  findTasksByProject(projectId, result) {
    Tasks.findAll({
      attributes: ["id", "name", "description", "start_time", "end_time"],
      where: {
        projectId: projectId,
      },
      include: [
        {
          model: Projects,
          as: "project",
          attributes: ["id", "name", "description", "end_time"],
        },
      ],
    })
      .then((tasks) => {
        result(null, tasks);
      })
      .catch((error) => {
        result(error.message, null);
      });
  },
  findProjectUsers(projectId, result) {
    Tasks.findAll({
      distinct: true,
      attributes: [],
      where: {
        projectId: projectId,
      },
      include: {
        model: Users,
        as: "user",
        attributes: ["id", "email"],
      },
    })
      .then((users) => {
        result(null, users);
      })
      .catch((error) => {
        {
          result(error, null);
        }
      });
  },
  findUserTasksByProject(userId, projectId, result) {
    Tasks.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "status",
        "start_time",
        "end_time",
      ],
      where: {
        projectId: projectId,
        userId: userId,
      },
      include: [
        {
          model: Projects,
          as: "project",
          attributes: ["id", "name", "description", "status", "end_time"],
        },
        {
          model: Users,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    })
      .then((tasks) => {
        result(null, tasks);
      })
      .catch((error) => {
        result(error.message, null);
      });
  },
  findTasksByUser(userId, result) {
    Tasks.findAll({
      attributes: ["id", "name", "description", "status"],
      where: {
        userId: userId,
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: Projects,
          as: "project",
          attributes: ["id", "name", "description"],
        },
      ],
    })
      .then((tasks) => {
        result(null, tasks);
      })
      .catch((error) => {
        result(error, null);
      });
  },
  findDepartmentalTasks(departmentId, result) {
    Tasks.findAll({
      attributes: ["id", "name", "status", "description"],
      include: {
        model: Users,
        as: "user",
        attributes: ["id", "email"],
        include: {
          model: Departments,
          as: "department",
          attributes: ["id", "name"],
          where: {
            id: departmentId,
          },
        },
      },
    })
      .then((tasks) => {
        result(null, tasks);
      })
      .catch((err) => {
        result(err, null);
      });
  },
  getProgress(projectId, result) {
    let alltasks = {};
    let completeTasks = [];
    Tasks.findAll({
      attributes: ["id", "status"],
      where: {
        projectId: projectId,
      },
    })
      .then((tasks) => {
        alltasks.allTasks = tasks.length;
        tasks.forEach((element) => {
          if (element.status == "complete") {
            completeTasks.push(element);
          }
        });
        alltasks.Complete = completeTasks.length;
        result(null, alltasks);
      })
      .catch((error) => result(error, null));
  },
};

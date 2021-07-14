const sequelize = require("sequelize");
const Projects = require("../../models").Projects;
const Tasks = require("../../models").Tasks;
const Users = require("../../models").Users;
const Departments = require("../../models").Departments;
const Privileges = require("../../models").Privileges;
const Permissions = require("../../models").Permissions;
const Resources = require("../../models").Resources;
const projectValidator = require("../validation/projectValidator");
const uniqueVal = require("../utility/unique");
const Op = sequelize.Op;

module.exports = {
  createProject(projectData, result) {
    const { isValid, error } = projectValidator.projectValidator(projectData);
    if (isValid) {
      Projects.findAll({
        where: {
          name: projectData.name,
        },
      }).then((names) => {
        if (names.length > 0) {
          result({ error: "Project name already exists." }, null);
        } else {
          Departments.findByPk(projectData.departmentId)
            .then((department) => {
              if (department !== null) {
                //Check if user belongs to the provided department id
                Users.findOne({
                  attributes: ["departmentId"],
                  where: {
                    id: projectData.userId,
                  },
                })
                  .then((user) => {
                    const usersDepartment = user.departmentId;
                    if (projectData.departmentId === usersDepartment) {
                      Projects.create({
                        name: projectData.name,
                        description: projectData.description,
                        status: projectData.status,
                        start_time: projectData.startTime,
                        departmentId: projectData.departmentId,
                      })
                        .then(() => {
                          result(null, {
                            message:
                              "Your project has been created successfully.",
                          });
                        })
                        .catch((err) => {
                          result(err, null);
                        });
                    } else {
                      result(
                        {
                          error:
                            "You can only create a project for your Department",
                        },
                        null
                      );
                    }
                  })
                  .catch((error) => result(error, null));
              } else {
                result(
                  { error: "DepartmentId provided does not exist." },
                  null
                );
              }
            })
            .catch((err) => {
              result(err, null);
            });
        }
      });
    } else {
      result(error, null);
    }
  },

  updateProject(updateProjectData, result) {
    const { error, isValid } =
      projectValidator.updateProject(updateProjectData);
    if (isValid) {
      Projects.findByPk(updateProjectData.projectId)
        .then((project) => {
          if (project !== null) {
            Projects.findAll({
              where: {
                [Op.and]: [
                  { name: updateProjectData.name },
                  { id: { [Op.ne]: updateProjectData.projectId } },
                ],
              },
            })
              .then((foundOne) => {
                if (foundOne.length > 0) {
                  result({ error: "Project name already taken" }, null);
                } else {
                  project
                    .update({
                      name: updateProjectData.name,
                      description: updateProjectData.description,
                      status: updateProjectData.status,
                      end_time: updateProjectData.endTime,
                      start_time: updateProjectData.startTime,
                      departmentId: updateProjectData.departmentId,
                    })
                    .then((updated) =>
                      result(null, { message: "Project Update Successful" })
                    )
                    .catch((err) => result(err, null));
                }
              })
              .catch((error) => result(error, null));
          } else {
            result({ error: "No Project found by that Id" }, null);
          }
        })
        .catch((error) => result(error, null));
    } else {
      result(error, null);
    }
  },

  deleteProject(projectInfo, result) {
    //
    const { error, isValid } = projectValidator.deleteProject(projectInfo);
    if (isValid) {
      let Role;
      let ResourceId;
      //Get the role of the sidgned in user
      Users.findByPk(projectInfo.loggedUserId)
        .then((foundUser) => {
          //
          if (foundUser !== null) {
            //set the global role to value in roleId
            Role = foundUser.roleId;
            //
            //Get the resource housing the record
            Resources.findOne({
              where: {
                name: "Projects",
              },
            })
              .then((resource) => {
                ResourceId = resource.id;
                //
                //Access the privileges table with the role and the resource
                Privileges.findOne({
                  where: {
                    [Op.and]: [
                      {
                        roleId: Role,
                      },
                      {
                        resourceId: ResourceId,
                      },
                    ],
                  },
                })
                  .then((privilegeFound) => {
                    if (privilegeFound !== null) {
                      //Get the permission associated to the two
                      const permission = privilegeFound.permissionId;
                      //With the permission, check whether operation is allowed
                      Permissions.findByPk(permission)
                        .then((authorise) => {
                          if (authorise.can_delete) {
                            Projects.findByPk(projectInfo.projectId)
                              .then((projo) => {
                                if (projo !== null) {
                                  projo
                                    .destroy()
                                    .then((deleted) => {
                                      result(null, {
                                        message: "Deletion Successfull",
                                      });
                                    })
                                    .catch((err) =>
                                      result(
                                        {
                                          error: err,
                                        },
                                        null
                                      )
                                    );
                                } else {
                                  result(
                                    {
                                      error: "Unknown project provided",
                                    },
                                    null
                                  );
                                }
                              })
                              .catch((err) =>
                                result(
                                  {
                                    error: err,
                                  },
                                  null
                                )
                              );
                          } else {
                            result(
                              {
                                error: "Unauthorised Operation",
                              },
                              null
                            );
                          }
                        })
                        .catch((err) =>
                          result(
                            {
                              error: err,
                            },
                            null
                          )
                        );
                    } else {
                      result(
                        {
                          error:
                            "Unauthorised Operation. Contact your line manager",
                        },
                        null
                      );
                    }
                  })
                  .catch((err) =>
                    result(
                      {
                        error: err,
                      },
                      null
                    )
                  );
              })
              .catch((err) =>
                result(
                  {
                    error: err,
                  },
                  null
                )
              );
          } else {
            result(
              {
                error: "Unknown project provided",
              },
              null
            );
          }
        })
        .catch((error) =>
          result(
            {
              error: error,
            },
            null
          )
        );
    } else {
      result({ error: error }, null);
    }
    // Projects.findByPk(projectId)
    //   .then((project) => {
    //     project
    //       .destroy()
    //       .then(() => {
    //         result(null, { message: "Project deleted successfully." });
    //       })
    //       .catch((err) => {
    //         result(err, null);
    //       });
    //   })
    //   .catch((err) => {
    //     result(null, { message: "Project does not exist." });
    //   });
  },

  findProject(projectId, result) {
    Projects.findOne({
      where: {
        id: projectId,
      },
      include: {
        model: Departments,
        as: "department",
        attributes: ["name"],
      },
    })
      .then((project) => {
        result(null, project);
      })
      .catch((err) => {
        result(err, null);
      });
  },

  findDepartmentProjects(departmentId, result) {
    Projects.findAll({
      where: {
        departmentId,
      },
    })
      .then((projects) => {
        if (projects.length < 1) {
          result(null, { message: "No project found." });
        } else {
          result(null, projects);
        }
      })
      .catch((err) => {
        result(err, null);
      });
  },

  findProjectByState(status, result) {
    Projects.findAll({
      where: {
        status,
      },
    })
      .then((projects) => {
        result(null, projects);
      })
      .catch((err) => {
        result(err, null);
      });
  },

  findAllProjects(result) {
    Projects.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "status",
        "start_time",
        "end_time",
      ],
      include: {
        model: Departments,
        as: "department",
        attributes: ["id", "name"],
      },
    })
      .then((project) => {
        result(null, project);
      })
      .catch((err) => {
        result(err, null);
      });
  },
  findProjectParticipants(projectId, result) {
    //Every task belongs to a particular project
    //thus finding out users linked to a particular task that belongs to the given projectId
    //can lead me to project participants.
    Projects.findByPk(projectId)
      .then((foundOne) => {
        if (foundOne !== null) {
          Tasks.findAll({
            attributes: [],
            where: {
              projectId: projectId,
            },
            include: {
              model: Users,
              as: "user",
              attributes: ["id", "email", "first_name", "last_name"],
            },
          })
            .then((foundRecord) => {
              let arr = [];
              foundRecord.forEach((element) => {
                arr.push(element.user);
              });
              const response = uniqueVal.returnUnique(arr);
              result(null, response);
            })
            .catch((error) => result(error, null));
        } else {
          result({ error: "Project by that Id does not exist" }, null);
        }
      })
      .catch((error) => result(error, null));
  },
};

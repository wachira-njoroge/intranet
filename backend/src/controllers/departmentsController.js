const Departments = require("../../models").Departments;
const Projects = require("../../models").Projects;
const Roles = require("../../models").Roles;
const Users = require("../../models").Users;
const Tasks = require("../../models").Tasks;
const Resources = require("../../models").Resources;
const Privileges = require("../../models").Privileges;
const Permissions = require("../../models").Permissions;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const validator = require("../validation/departmentValidator");
//
module.exports = {
  createDepartment(departmentInfo, result) {
    //
    //Validate incoming post data
    const { error, isValid } = validator.creationInfo(departmentInfo);
    //
    //If validated, continue
    if (isValid) {
      //Check whether there`s an existing record with that name
      Departments.findAll({
        where: {
          name: departmentInfo.name,
        },
        raw: true,
      })
        .then((found) => {
          let error = {};
          if (found.length > 0) {
            error.name = "Department name already exists.";
            result(error, null);
          } else {
            //create record
            Departments.create({
              name: departmentInfo.name,
              tagline: departmentInfo.slogan,
            })
              .then((success) => {
                result(null, { message: "Department Created Successfully." });
              })
              .catch((err) => result(err, null));
          }
        })
        .catch((error) => result(error, null));
    } else {
      result(error, null);
    }
  },
  getAll(result) {
    Departments.findAll({ attributes: ["id", "name", "tagline"] })
      .then((found) => result(null, found))
      .catch((err) => result(err, null));
  },
  getById(id, result) {
    Departments.findOne({
      where: {
        id: id,
      },
    })
      .then((found) => {
        result(null, found);
      })
      .catch((err) => {
        result(err, null);
      });
  },
  updateInfo(paramId, info, result) {
    const { error, isValid } = validator.updateData(info);
    if (isValid) {
      Departments.findByPk(paramId)
        .then((department) => {
          if (department !== null) {
            Departments.findOne({
              where: {
                [Op.and]: [
                  { name: info.name },
                  {
                    id: {
                      [Op.ne]: paramId,
                    },
                  },
                ],
              },
            })
              .then((found) => {
                if (found) {
                  result(
                    { error: "Cannot update to the specified name." },
                    null
                  );
                } else {
                  //Ensure whoever is updating is a manager
                  const intUser = parseInt(info.userId);
                  if (intUser === department.manager) {
                    department
                      .update({
                        name: info.name,
                        tagline: info.slogan,
                      })
                      .then((updated) => {
                        result(null, { message: "Update Successful" });
                      })
                      .catch((err) => result({ error: err }, null));
                  } else {
                    result(
                      {
                        error:
                          "Kindly inform your line manager of what you're trying to do!",
                      },
                      null
                    );
                  }
                }
              })
              .catch((error) => result(error, null));
          } else {
            result({ error: "No Department found By that Id" });
          }
        })
        .catch((err) => result(err, null));
    } else {
      result(error, null);
    }
  },
  getMembers(departmentId, result) {
    Departments.findByPk(departmentId)
      .then((department) => {
        if (department !== null) {
          Users.findAll({
            attributes: ["first_name", "last_name", "email", "contact"],
            where: {
              departmentId: departmentId,
            },
            include: {
              model: Roles,
              as: "role",
              attributes: ["role_name"],
            },
          })
            .then((users) => {
              result(null, users);
            })
            .catch((error) => result(error, null));
        } else {
          result({ error: "No department found by that Id" }, null);
        }
      })
      .catch((error) => result(error, null));
  },
  addManager(details, result) {
    const { error, isValid } = validator.linemanager(details);
    if (isValid) {
      Users.findByPk(details.userId)
        .then((user) => {
          if (user !== null) {
            //get the department id
            deptId = user.departmentId;
            //Ensure deptId value passed in post data matches user dept
            if (deptId === details.departmentId) {
              //Update user roleId to manager
              Roles.findAll({
                where: {
                  role_name: "manager",
                },
              })
                .then((role) => {
                  //If successful,get the roleId from the response
                  roleid = role[0].id;
                  //Update user role
                  user
                    .update({
                      roleId: roleid,
                    })
                    .then((roleUpdated) => {
                      Departments.findByPk(deptId)
                        .then((departmentfound) => {
                          if (departmentfound) {
                            departmentfound
                              .update({
                                manager: user.id,
                              })
                              .then((managerAssigned) => {
                                result(null, {
                                  message: "Manager assigned Successfully",
                                });
                              })
                              .catch((error) => result(error, null));
                          }
                        })
                        .catch((error) => result(error, null));
                    })
                    .catch((error) => result(error, null));
                })
                .catch((error) => result(error, null));
            } else {
              result(
                {
                  error:
                    "You can only assign a manager from existing department members",
                },
                null
              );
            }
          } else {
            result({ error: "Kindly provide a valid user" }, null);
          }
        })
        .catch((error) => result(error, null));
    } else {
      result(error, null);
    }
  },
  delete(departmentInfo, result) {
    const { error, isValid } = validator.deleteProject(departmentInfo);
    if (isValid) {
      let Role;
      let ResourceId;
      //Get the role of the signed in user
      Users.findByPk(departmentInfo.loggedUserId)
        .then((foundUser) => {
          //
          if (foundUser !== null) {
            //set the global role to value in roleId
            Role = foundUser.roleId;
            //
            //Get the resource housing the record
            Resources.findOne({
              where: {
                name: "Departments",
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
                            Departments.findByPk(departmentInfo.deptId)
                              .then((dept) => {
                                if (dept !== null) {
                                  dept
                                    .destroy()
                                    .then((deleted) => {
                                      result(null, {
                                        message: "Deletion Successfull",
                                      });
                                    })
                                    .catch((err) =>
                                      result(
                                        {
                                          error: err.message,
                                        },
                                        null
                                      )
                                    );
                                } else {
                                  result(
                                    {
                                      error: "Unknown department provided",
                                    },
                                    null
                                  );
                                }
                              })
                              .catch((err) =>
                                result(
                                  {
                                    error: err.message,
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
                              error: err.message,
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
                        error: err.message,
                      },
                      null
                    )
                  );
              })
              .catch((err) =>
                result(
                  {
                    error: err.message,
                  },
                  null
                )
              );
          } else {
            result(
              {
                error: "Unknown department provided",
              },
              null
            );
          }
        })
        .catch((error) =>
          result(
            {
              error: error.message,
            },
            null
          )
        );
    } else {
      result({ error: error }, null);
    }
  },
};

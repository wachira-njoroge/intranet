const sequelize = require("sequelize");
const Users = require("../../models").Users;
const Teams = require("../../models").Teams;
const Roles = require("../../models").Roles;
const Departments = require("../../models").Departments;
const Privileges = require("../../models").Privileges;
const Permissions = require("../../models").Permissions;
const Resources = require("../../models").Resources;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginValidator = require("../validation/personnelValidator");
const secret = require("../../config").keys;
const Op = sequelize.Op;

module.exports = {
  getUsers(result) {
    Users.findAll({
        attributes: ["id", "first_name", "last_name", "email"],
        include: [{
            model: Departments,
            as: "department",
            attributes: ["id", "name"],
          },
          {
            model: Roles,
            as: "role",
            attributes: ["id", "role_name"],
          },
        ],
      })
      .then((users) => {
        result(null, users);
      })
      .catch((err) => {
        result(err.message, null);
      });
  },
  getUsersById(userId, result) {
    Users.findOne({
        where: {
          id: userId,
          include: {
            model: Departments,
            as: "user",
            attributes: ["name"],
          },
        },
      })
      .then((user) => {
        if (user) {
          result(null, user);
        } else {
          result(null, {
            message: `User not found.`,
          });
        }
      })
      .catch((error) => {
        result(error, null);
      });
  },

  getTeamMembersByTeam(teamId, result) {
    Users.findAll({
        attributes: ["id", "first_name", "last_name"],
        where: {
          teamId: teamId,
        },
        include: [{
            model: Teams,
            as: "team",
            attributes: ["name"],
          },
          {
            model: Departments,
            as: "department",
            attributes: ["name"],
          },
        ],
      })
      .then((found) => {
        if (found.length < 1) {
          result({
              error: "No user found in the specified Team..try another one",
            },
            null
          );
        } else {
          result(null, found);
        }
      })
      .catch((err) => {
        result(err, null);
      });
  },
  login(loginData, result) {
    const {
      error,
      isValid
    } = loginValidator.login(loginData);
    if (isValid) {
      Users.findOne({
          where: {
            username: loginData.username,
          },
          raw: true,
        })
        .then((user) => {
          if (user) {
            bcrypt
              .compare(loginData.password, user.password)
              .then((isMatch) => {
                if (isMatch) {
                  const data = {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    username: user.username,
                    phone_number: user.contact,
                    id: user.id,
                    departmentId: user.departmentId,
                  };
                  jwt.sign(
                    data,
                    secret.secretKey, {
                      expiresIn: "30",
                    },
                    (error, token) => {
                      if (error) {
                        result({
                            error: "An error occured while trying to login.",
                          },
                          null
                        );
                      } else {
                        result(null, {
                          token,
                        });
                      }
                    }
                  );
                } else {
                  result({
                      error: "Wrong username or password.",
                    },
                    null
                  );
                }
              });
          } else {
            result({
                error: "Wrong username or password.",
              },
              null
            );
          }
        })
        .catch((error) => {
          result(error, null);
        });
    } else {
      result(error, null);
    }
  },

  registerUser(registrationData, result) {
    const {
      error,
      isValid
    } = loginValidator.registration(registrationData);
    if (isValid) {
      const hashedPass = bcrypt.hashSync(registrationData.password, 12);
      //Check if department provided exists
      Departments.findByPk(registrationData.departmentId)
        .then((department) => {
          if (department !== null) {
            //Proceed to user registration
            Users.findAll({
                where: {
                  [Op.or]: [{
                      username: registrationData.username,
                    },
                    {
                      contact: registrationData.contact,
                    },
                    {
                      email: registrationData.email,
                    },
                  ],
                },
                raw: true,
              })
              .then((user) => {
                if (user.length > 0) {
                  err = [];
                  user.forEach((u) => {
                    if (u.username == registrationData.username) {
                      err.push("Username exists");
                    }
                    if (u.email == registrationData.email) {
                      err.push("Email already exists");
                    }
                    if (u.contact == registrationData.contact) {
                      err.push("Contact already exists");
                    }
                  });
                  result({
                      error: err,
                    },
                    null
                  );
                } else {
                  //Get the default Role id
                  let Role;
                  Roles.findOne({
                      where: {
                        role_name: "default",
                      },
                    })
                    .then((roleFound) => {
                      Role = roleFound.id;
                      //
                      Users.create({
                          first_name: registrationData.firstName,
                          last_name: registrationData.lastName,
                          username: registrationData.username,
                          contact: registrationData.contact,
                          password: hashedPass,
                          email: registrationData.email,
                          roleId: Role,
                          departmentId: registrationData.departmentId,
                        })
                        .then(() => {
                          result(null, {
                            message: "Registration Successfull.",
                          });
                        })
                        .catch((err) => {
                          result(err.message, null);
                        });
                    })
                    .catch((error) => result(error, null));
                }
              })
              .catch((err) => {
                result(err.message, null);
              });
          } else {
            result({
                error: "Department specified doesn`t exist",
              },
              null
            );
          }
        })
        .catch((error) => result(error, null));
      //
    } else {
      result(error, null);
    }
  },

  removeUser(userInfo, result) {
    //
    //Get the user role from the loggedin user
    const {
      error,
      isValid
    } = loginValidator.delete(userInfo);
    if (isValid) {
      let Role;
      let ResourceId;
      //Get the role of the sidgned in user
      Users.findByPk(userInfo.loggedUserId)
        .then((foundUser) => {
          //
          if (foundUser !== null) {
            //set the global role to value in roleId
            Role = foundUser.roleId;
            //
            //Get the resource housing the record
            Resources.findOne({
                where: {
                  name: "Users",
                },
              })
              .then((resource) => {
                ResourceId = resource.id;
                //
                //Access the privileges table with the role and the resource
                Privileges.findOne({
                    where: {
                      [Op.and]: [{
                        roleId: Role
                      }, {
                        resourceId: ResourceId
                      }],
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
                            Users.findByPk(userInfo.userId)
                              .then((user) => {
                                if (user !== null) {
                                  user
                                    .destroy()
                                    .then((deleted) => {
                                      result(null, {
                                        message: "Deletion Successfull",
                                      });
                                    })
                                    .catch((err) =>
                                      result({
                                        error: err
                                      }, null)
                                    );
                                } else {
                                  result({
                                      error: "Unknown user provided"
                                    },
                                    null
                                  );
                                }
                              })
                              .catch((err) => result({
                                error: err
                              }, null));
                          } else {
                            result({
                              error: "Unauthorised Operation"
                            }, null);
                          }
                        })
                        .catch((err) => result({
                          error: err
                        }, null));
                    } else {
                      result({
                          error: "Unauthorised Operation. Contact your line manager",
                        },
                        null
                      );
                    }
                  })
                  .catch((err) => result({
                    error: err
                  }, null));
              })
              .catch((err) => result({
                error: err
              }, null));
          } else {
            result({
              error: "Unknown user provided"
            }, null);
          }
        })
        .catch((error) => result({
          error: error
        }, null));
    } else {
      result({
        error: error
      }, null);
    }
  },
  resetPassword(resetData, result) {
    const {
      error,
      isValid
    } = loginValidator.reset(resetData);
    if (isValid) {
      const newpass = bcrypt.hashSync(resetData.password, 12);
      Users.findOne({
          where: {
            [Op.and]: [{
                username: resetData.username,
              },
              {
                contact: resetData.contact,
              },
            ],
          },
        })
        .then((user) => {
          if (user !== null) {
            user
              .update({
                password: newpass,
              })
              .then((passUpdated) => {
                result(null, {
                  message: "Password Update Successfull",
                });
              })
              .catch((err) =>
                result({
                    error: err,
                  },
                  null
                )
              );
          } else {
            result({
                error: "Invalid Contact value",
              },
              null
            );
          }
        })
        .catch((err) => {
          result({
              error: err,
            },
            null
          );
        });
    } else {
      result({
          error: error,
        },
        null
      );
    }
  },

  changeProfile(userId, profileData, result) {
    const {
      error,
      isValid
    } = loginValidator.update(profileData);
    if (isValid) {
      Users.findByPk(userId)
        .then((user) => {
          if (user !== null) {
            //Ensure department provided exists
            if (profileData.departmentId !== undefined) {
              Departments.findByPk(profileData.departmentId)
                .then((department) => {
                  if (department !== null) {
                    user
                      .update({
                        contact: profileData.contact,
                        username: profileData.username,
                        last_name: profileData.lastName,
                        first_name: profileData.firstName,
                        email: profileData.email,
                        departmentId: profileData.departmentId,
                      })
                      .then((success) => {
                        result(null, {
                          message: "Update Successful.",
                        });
                      })
                      .catch((err) => {
                        result(err, null);
                      });
                  } else {
                    result({
                        error: "DepartmentId provided is Non-existent",
                      },
                      null
                    );
                  }
                })
                .catch((error) => result(error, null));
            } else {
              user
                .update({
                  contact: profileData.contact,
                  username: profileData.username,
                  last_name: profileData.lastName,
                  first_name: profileData.firstName,
                  email: profileData.email,
                })
                .then((success) => {
                  result(null, {
                    message: "Profile Update Successful.",
                  });
                })
                .catch((err) => {
                  result(err, null);
                });
            }
          } else {
            result({
                error: "User By that Id not found",
              },
              null
            );
          }
        })
        .catch((error) => result(error, null));
    } else {
      result(error, null);
    }
  },
  updateRole(userInfo, result) {
    //Validate post input
    const {
      error,
      isValid
    } = loginValidator.roleUpdate(userInfo);
    if (isValid) {
      //Get the role of choice from post data
      const role = userInfo.roleName;
      Roles.findOne({
          where: {
            role_name: role,
          },
        })
        .then((roleFound) => {
          //Get the role id
          if (roleFound !== null) {
            const role_id = roleFound.id;
            //Ensure user id provided exists
            Users.findOne({
                where: {
                  id: userInfo.userId,
                },
              })
              .then((user) => {
                user
                  .update({
                    roleId: role_id,
                  })
                  .then((roleupdated) => {
                    result(null, {
                      message: "User Role updated successfully",
                    });
                  })
                  .catch((error) =>
                    result({
                        error: error,
                      },
                      null
                    )
                  );
              })
              .catch((err) =>
                result({
                    error: err,
                  },
                  null
                )
              );
          } else {
            result({
                error: "Role name provided is unknown",
              },
              null
            );
          }
        })
        .catch((error) =>
          result({
              error: error,
            },
            null
          )
        );
    } else {
      result({
          error: error,
        },
        null
      );
    }
  },
};
